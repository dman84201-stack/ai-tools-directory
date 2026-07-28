import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Categories for AI tools
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }), // URL to icon
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// AI Tools directory listings
export const tools = mysqlTable("tools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("longDescription"), // For detail pages
  categoryId: int("categoryId").notNull().references(() => categories.id),
  tags: varchar("tags", { length: 500 }), // Comma-separated tags
  pricingType: mysqlEnum("pricingType", ["free", "freemium", "paid"]).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 500 }).notNull(),
  affiliateUrl: varchar("affiliateUrl", { length: 500 }), // Optional affiliate link
  isFeatured: mysqlEnum("isFeatured", ["none", "featured", "sponsored"]).default("none").notNull(),
  featuredUntil: timestamp("featuredUntil"), // When featured status expires
  isApproved: tinyint("isApproved").default(0).notNull(),
  submittedBy: int("submittedBy").references(() => users.id), // User who submitted (if not auto-generated)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tool = typeof tools.$inferSelect;
export type InsertTool = typeof tools.$inferInsert;

// Tool submissions (paid feature)
export const toolSubmissions = mysqlTable("toolSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  categoryId: int("categoryId").notNull().references(() => categories.id),
  tags: varchar("tags", { length: 500 }),
  pricingType: mysqlEnum("pricingType", ["free", "freemium", "paid"]).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 500 }).notNull(),
  affiliateUrl: varchar("affiliateUrl", { length: 500 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }).notNull(),
  submitterName: varchar("submitterName", { length: 255 }),
  isFeatured: tinyint("isFeatured").default(0).notNull(), // Paid featured listing
  stripePaymentId: varchar("stripePaymentId", { length: 255 }), // Stripe payment reference
  paymentStatus: mysqlEnum("paymentStatus", ["free", "pending", "completed", "failed"]).default("pending").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ToolSubmission = typeof toolSubmissions.$inferSelect;
export type InsertToolSubmission = typeof toolSubmissions.$inferInsert;

// Featured listings (for tracking paid featured placements)
export const featuredListings = mysqlTable("featuredListings", {
  id: int("id").autoincrement().primaryKey(),
  toolId: int("toolId").notNull().references(() => tools.id),
  submissionId: int("submissionId").references(() => toolSubmissions.id),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  durationDays: int("durationDays").default(30).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FeaturedListing = typeof featuredListings.$inferSelect;
export type InsertFeaturedListing = typeof featuredListings.$inferInsert;