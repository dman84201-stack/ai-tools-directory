import { getDb } from "./server/db";
import { categories, tools } from "./drizzle/schema";

const seedCategories = [
  { name: "Writing", slug: "writing", description: "AI tools for content writing and copywriting" },
  { name: "Design", slug: "design", description: "AI tools for graphic design and visual creation" },
  { name: "Coding", slug: "coding", description: "AI tools for software development" },
  { name: "Marketing", slug: "marketing", description: "AI tools for marketing and analytics" },
  { name: "Productivity", slug: "productivity", description: "AI tools for productivity and organization" },
  { name: "Video", slug: "video", description: "AI tools for video editing and creation" },
  { name: "Audio", slug: "audio", description: "AI tools for audio and music" },
  { name: "Research", slug: "research", description: "AI tools for research and data analysis" },
];

const seedTools = [
  { name: "ChatGPT", slug: "chatgpt", description: "Advanced AI language model for conversations", categoryId: 1, tags: "AI,Writing,Chat", pricingType: "freemium" as const, websiteUrl: "https://openai.com/chatgpt", isApproved: 1 },
  { name: "Claude", slug: "claude", description: "AI assistant by Anthropic", categoryId: 1, tags: "AI,Writing,Chat", pricingType: "freemium" as const, websiteUrl: "https://claude.ai", isApproved: 1 },
  { name: "Midjourney", slug: "midjourney", description: "AI image generation tool", categoryId: 2, tags: "AI,Design,Images", pricingType: "paid" as const, websiteUrl: "https://midjourney.com", isApproved: 1 },
  { name: "DALL-E 3", slug: "dalle3", description: "OpenAI's image generation model", categoryId: 2, tags: "AI,Design,Images", pricingType: "paid" as const, websiteUrl: "https://openai.com/dall-e-3", isApproved: 1 },
  { name: "GitHub Copilot", slug: "github-copilot", description: "AI pair programmer", categoryId: 3, tags: "AI,Coding,Development", pricingType: "paid" as const, websiteUrl: "https://github.com/features/copilot", isApproved: 1 },
  { name: "Jasper", slug: "jasper", description: "AI content writing platform", categoryId: 1, tags: "AI,Writing,Content", pricingType: "paid" as const, websiteUrl: "https://jasper.ai", isApproved: 1 },
  { name: "Copy.ai", slug: "copyai", description: "AI copywriting tool", categoryId: 1, tags: "AI,Writing,Marketing", pricingType: "freemium" as const, websiteUrl: "https://copy.ai", isApproved: 1 },
  { name: "Synthesia", slug: "synthesia", description: "AI video generation platform", categoryId: 6, tags: "AI,Video,Creation", pricingType: "paid" as const, websiteUrl: "https://synthesia.io", isApproved: 1 },
  { name: "Runway", slug: "runway", description: "AI video editing and creation", categoryId: 6, tags: "AI,Video,Editing", pricingType: "freemium" as const, websiteUrl: "https://runwayml.com", isApproved: 1 },
  { name: "Descript", slug: "descript", description: "AI-powered video and podcast editor", categoryId: 7, tags: "AI,Audio,Video", pricingType: "freemium" as const, websiteUrl: "https://descript.com", isApproved: 1 },
];

async function seed() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    console.log("Seeding categories...");
    for (const cat of seedCategories) {
      await db.insert(categories).values(cat).onDuplicateKeyUpdate({ set: cat });
    }
    console.log("Categories seeded!");

    console.log("Seeding tools...");
    for (const tool of seedTools) {
      await db.insert(tools).values(tool).onDuplicateKeyUpdate({ set: tool });
    }
    console.log("Tools seeded!");
    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
