import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { categories, tools } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

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
  // Writing (categoryId 1)
  { name: "ChatGPT", slug: "chatgpt", description: "Advanced AI language model for conversations, writing, and general assistance", categoryId: 1, tags: "AI,Writing,Chat", pricingType: "freemium", websiteUrl: "https://openai.com/chatgpt", isApproved: 1 },
  { name: "Claude", slug: "claude", description: "AI assistant by Anthropic, strong at long-form writing and reasoning", categoryId: 1, tags: "AI,Writing,Chat", pricingType: "freemium", websiteUrl: "https://claude.ai", isApproved: 1 },
  { name: "Jasper", slug: "jasper", description: "AI content platform built for brand-consistent marketing and long-form content at scale", categoryId: 1, tags: "AI,Writing,Content", pricingType: "paid", websiteUrl: "https://jasper.ai", isApproved: 1 },
  { name: "Copy.ai", slug: "copyai", description: "AI copywriting tool for ad copy, emails, and marketing content", categoryId: 1, tags: "AI,Writing,Marketing", pricingType: "freemium", websiteUrl: "https://copy.ai", isApproved: 1 },
  { name: "Writesonic", slug: "writesonic", description: "AI writer for blog posts, ad copy, and SEO-optimized content", categoryId: 1, tags: "AI,Writing,SEO", pricingType: "freemium", websiteUrl: "https://writesonic.com", isApproved: 1 },
  { name: "Grammarly", slug: "grammarly", description: "AI writing assistant for grammar, tone, and clarity across any app", categoryId: 1, tags: "AI,Writing,Editing", pricingType: "freemium", websiteUrl: "https://grammarly.com", isApproved: 1 },

  // Design (categoryId 2)
  { name: "Midjourney", slug: "midjourney", description: "AI image generation tool known for high-quality, stylized art", categoryId: 2, tags: "AI,Design,Images", pricingType: "paid", websiteUrl: "https://midjourney.com", isApproved: 1 },
  { name: "DALL-E 3", slug: "dalle3", description: "OpenAI's image generation model, integrated into ChatGPT", categoryId: 2, tags: "AI,Design,Images", pricingType: "paid", websiteUrl: "https://openai.com/dall-e-3", isApproved: 1 },
  { name: "Canva Magic Studio", slug: "canva-magic-studio", description: "AI-powered design suite for social graphics, presentations, and marketing visuals", categoryId: 2, tags: "AI,Design,Templates", pricingType: "freemium", websiteUrl: "https://canva.com", isApproved: 1 },
  { name: "Adobe Firefly", slug: "adobe-firefly", description: "Adobe's generative AI for images, effects, and creative assets", categoryId: 2, tags: "AI,Design,Adobe", pricingType: "freemium", websiteUrl: "https://firefly.adobe.com", isApproved: 1 },
  { name: "Leonardo.Ai", slug: "leonardo-ai", description: "AI image generation platform with fine-tuned models for game assets and concept art", categoryId: 2, tags: "AI,Design,Art", pricingType: "freemium", websiteUrl: "https://leonardo.ai", isApproved: 1 },

  // Coding (categoryId 3)
  { name: "GitHub Copilot", slug: "github-copilot", description: "AI pair programmer that suggests code and entire functions in real time", categoryId: 3, tags: "AI,Coding,Development", pricingType: "paid", websiteUrl: "https://github.com/features/copilot", isApproved: 1 },
  { name: "Cursor", slug: "cursor", description: "AI-first code editor built for pair-programming with an AI agent", categoryId: 3, tags: "AI,Coding,IDE", pricingType: "freemium", websiteUrl: "https://cursor.com", isApproved: 1 },
  { name: "Replit", slug: "replit", description: "Browser-based coding platform with an integrated AI agent for building apps", categoryId: 3, tags: "AI,Coding,Cloud IDE", pricingType: "freemium", websiteUrl: "https://replit.com", isApproved: 1 },
  { name: "Tabnine", slug: "tabnine", description: "AI code completion tool with a focus on privacy and on-premises deployment", categoryId: 3, tags: "AI,Coding,Autocomplete", pricingType: "freemium", websiteUrl: "https://tabnine.com", isApproved: 1 },

  // Marketing (categoryId 4)
  { name: "Surfer SEO", slug: "surfer-seo", description: "AI-powered content optimization tool that scores pages against top search results", categoryId: 4, tags: "AI,Marketing,SEO", pricingType: "paid", websiteUrl: "https://surferseo.com", isApproved: 1 },
  { name: "Semrush", slug: "semrush", description: "SEO and content strategy platform with AI-assisted keyword and competitor research", categoryId: 4, tags: "AI,Marketing,SEO", pricingType: "paid", websiteUrl: "https://semrush.com", isApproved: 1 },
  { name: "HubSpot Breeze", slug: "hubspot-breeze", description: "AI layer across HubSpot's CRM and marketing hub for content, workflows, and reporting", categoryId: 4, tags: "AI,Marketing,CRM", pricingType: "freemium", websiteUrl: "https://hubspot.com", isApproved: 1 },
  { name: "Frase", slug: "frase", description: "AI content research and SEO writing tool for teams producing fewer, targeted articles", categoryId: 4, tags: "AI,Marketing,SEO", pricingType: "paid", websiteUrl: "https://frase.io", isApproved: 1 },

  // Productivity (categoryId 5)
  { name: "Notion AI", slug: "notion-ai", description: "AI assistant built into Notion for writing, summarizing, and organizing notes", categoryId: 5, tags: "AI,Productivity,Notes", pricingType: "freemium", websiteUrl: "https://notion.so", isApproved: 1 },
  { name: "Motion", slug: "motion", description: "AI calendar and task planner that automatically schedules your day", categoryId: 5, tags: "AI,Productivity,Scheduling", pricingType: "paid", websiteUrl: "https://usemotion.com", isApproved: 1 },
  { name: "Zapier", slug: "zapier", description: "Workflow automation platform with AI-powered Copilot for building automations", categoryId: 5, tags: "AI,Productivity,Automation", pricingType: "freemium", websiteUrl: "https://zapier.com", isApproved: 1 },
  { name: "Fireflies.ai", slug: "fireflies-ai", description: "AI meeting assistant that records, transcribes, and summarizes calls automatically", categoryId: 5, tags: "AI,Productivity,Meetings", pricingType: "freemium", websiteUrl: "https://fireflies.ai", isApproved: 1 },
  { name: "Gamma", slug: "gamma", description: "AI presentation and document builder that turns a prompt into a designed deck", categoryId: 5, tags: "AI,Productivity,Presentations", pricingType: "freemium", websiteUrl: "https://gamma.app", isApproved: 1 },

  // Video (categoryId 6)
  { name: "Synthesia", slug: "synthesia", description: "AI video generation platform with realistic avatars for training and marketing videos", categoryId: 6, tags: "AI,Video,Creation", pricingType: "paid", websiteUrl: "https://synthesia.io", isApproved: 1 },
  { name: "Runway", slug: "runway", description: "AI video editing and generation suite used for film, ads, and creative experimentation", categoryId: 6, tags: "AI,Video,Editing", pricingType: "freemium", websiteUrl: "https://runwayml.com", isApproved: 1 },
  { name: "Pika", slug: "pika", description: "AI video generation tool for turning text or images into short video clips", categoryId: 6, tags: "AI,Video,Generation", pricingType: "freemium", websiteUrl: "https://pika.art", isApproved: 1 },
  { name: "OpusClip", slug: "opusclip", description: "AI tool that turns long videos into short, ready-to-post social clips", categoryId: 6, tags: "AI,Video,Repurposing", pricingType: "freemium", websiteUrl: "https://opus.pro", isApproved: 1 },

  // Audio (categoryId 7)
  { name: "Descript", slug: "descript", description: "AI-powered video and podcast editor that lets you edit audio like a text document", categoryId: 7, tags: "AI,Audio,Video", pricingType: "freemium", websiteUrl: "https://descript.com", isApproved: 1 },
  { name: "ElevenLabs", slug: "elevenlabs", description: "AI voice generation and cloning platform for realistic text-to-speech", categoryId: 7, tags: "AI,Audio,Voice", pricingType: "freemium", websiteUrl: "https://elevenlabs.io", isApproved: 1 },
  { name: "Suno", slug: "suno", description: "AI music generation tool that creates full songs from a text prompt", categoryId: 7, tags: "AI,Audio,Music", pricingType: "freemium", websiteUrl: "https://suno.com", isApproved: 1 },
  { name: "Krisp", slug: "krisp", description: "AI noise cancellation app that removes background noise from calls in real time", categoryId: 7, tags: "AI,Audio,Calls", pricingType: "freemium", websiteUrl: "https://krisp.ai", isApproved: 1 },

  // Research (categoryId 8)
  { name: "Perplexity", slug: "perplexity", description: "AI answer engine that combines web search with cited, synthesized answers", categoryId: 8, tags: "AI,Research,Search", pricingType: "freemium", websiteUrl: "https://perplexity.ai", isApproved: 1 },
  { name: "Consensus", slug: "consensus", description: "AI research tool that searches peer-reviewed papers to answer evidence-based questions", categoryId: 8, tags: "AI,Research,Academic", pricingType: "freemium", websiteUrl: "https://consensus.app", isApproved: 1 },
  { name: "Elicit", slug: "elicit", description: "AI research assistant for systematic literature reviews and data extraction from papers", categoryId: 8, tags: "AI,Research,Academic", pricingType: "freemium", websiteUrl: "https://elicit.com", isApproved: 1 },
  { name: "NotebookLM", slug: "notebooklm", description: "Google's AI notebook that answers questions and summarizes grounded in your own documents", categoryId: 8, tags: "AI,Research,Notes", pricingType: "free", websiteUrl: "https://notebooklm.google", isApproved: 1 },
];

async function seed() {
  try {
    console.log("Seeding categories...");
    for (const cat of seedCategories) {
      await db.insert(categories).values(cat).onDuplicateKeyUpdate({ set: cat });
    }
    console.log("Categories seeded!");

    console.log("Seeding tools...");
    for (const tool of seedTools) {
      await db.insert(tools).values(tool).onDuplicateKeyUpdate({ set: tool });
    }
    console.log(`Tools seeded! (${seedTools.length} total)`);
    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
