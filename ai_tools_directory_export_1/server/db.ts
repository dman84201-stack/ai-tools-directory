import { eq, desc, and, or, like, gte, lte, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, tools, toolSubmissions, featuredListings, type Tool, type Category, type ToolSubmission } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Category helpers
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Tool helpers
export async function getApprovedTools(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  let query: any = db.select().from(tools).where(eq(tools.isApproved, 1)).orderBy(desc(tools.isFeatured), desc(tools.createdAt));
  if (limit) query = query.limit(limit);
  return await query;
}

export async function getToolsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tools).where(and(eq(tools.categoryId, categoryId), eq(tools.isApproved, 1))).orderBy(desc(tools.isFeatured), desc(tools.createdAt));
}

export async function getToolBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchTools(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(tools)
    .where(and(
      eq(tools.isApproved, 1),
      or(like(tools.name, searchTerm), like(tools.description, searchTerm), like(tools.tags, searchTerm))
    ))
    .orderBy(desc(tools.isFeatured), desc(tools.createdAt));
}

export async function createTool(tool: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(tools).values(tool);
  // mysql2 insert results expose the new row's id as insertId (drizzle passes this through as [OkPacket]).
  const insertId = Array.isArray(result) ? result[0]?.insertId : result?.insertId;
  return { ...result, insertId };
}

// Tool submission helpers
export async function getPendingSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(toolSubmissions).where(eq(toolSubmissions.status, "pending")).orderBy(desc(toolSubmissions.createdAt));
}

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(toolSubmissions).where(eq(toolSubmissions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubmission(submission: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(toolSubmissions).values(submission);
  return result;
}

export async function updateSubmission(id: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(toolSubmissions).set(updates).where(eq(toolSubmissions.id, id));
}

// Featured listing helpers
export async function createFeaturedListing(listing: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(featuredListings).values(listing);
}

export async function getFeaturedListingsByToolId(toolId: number) {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return await db.select().from(featuredListings).where(and(eq(featuredListings.toolId, toolId), gte(featuredListings.endDate, now)));
}

// Get featured/sponsored tools for homepage
export async function getFeaturedTools() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return await db.select().from(tools).where(and(eq(tools.isApproved, 1), ne(tools.isFeatured, "none"), gte(tools.featuredUntil, now))).orderBy(desc(tools.isFeatured)).limit(6);
}

// AI-powered semantic search - returns all approved tools for client-side matching
export async function getToolsForAISearch() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tools).where(eq(tools.isApproved, 1)).orderBy(desc(tools.isFeatured), desc(tools.createdAt));
}
