import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { getApprovedTools, getToolBySlug, searchTools, getToolsByCategory, getAllCategories, getCategoryBySlug, getCategoryById, getPendingSubmissions, getSubmissionById, createSubmission, updateSubmission, createTool, createFeaturedListing, getFeaturedTools, getToolsForAISearch } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  tools: router({
    featured: publicProcedure.query(async () => {
      return await getFeaturedTools();
    }),
    list: publicProcedure.query(async () => {
      return await getApprovedTools();
    }),
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await getToolBySlug(input);
      }),
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await searchTools(input);
      }),
    byCategory: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getToolsByCategory(input);
      }),
    aiSearch: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const allTools = await getToolsForAISearch();
        const { invokeLLM } = await import("./_core/llm");
        const toolsList = allTools.map(t => ({
          name: t.name,
          description: t.description,
          tags: t.tags,
          pricingType: t.pricingType,
        })).slice(0, 30);
        
        const prompt = `You are an AI assistant helping users find the right tools. User's task: "${input}"

Available tools:
${JSON.stringify(toolsList, null, 2)}

Recommend the top 5 most relevant tools. Return ONLY a JSON array of tool names: ["Tool1", "Tool2", ...]`;

        try {
          const response = await invokeLLM({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
          });
          
          const content = (response.choices[0]?.message?.content as string) || "[]";
          const toolNames = JSON.parse(content);
          const results = allTools.filter(t => toolNames.includes(t.name));
          return results;
        } catch (error) {
          console.error("AI search error:", error);
          return [];
        }
      }),
  }),

  categories: router({
    list: publicProcedure.query(async () => {
      return await getAllCategories();
    }),
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await getCategoryBySlug(input);
      }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getCategoryById(input);
      }),
  }),

  submissions: router({
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        categoryId: z.number(),
        tags: z.string().optional(),
        pricingType: z.enum(["free", "freemium", "paid"]),
        websiteUrl: z.string().url(),
        affiliateUrl: z.string().url().optional(),
        submitterEmail: z.string().email(),
        submitterName: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createSubmission({
          ...input,
          status: "pending",
          paymentStatus: input.isFeatured ? "pending" : "free",
        });
      }),
  }),

  admin: router({
    submissions: adminProcedure.query(async () => {
      return await getPendingSubmissions();
    }),
    getSubmission: adminProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getSubmissionById(input);
      }),
    approveSubmission: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const submission = await getSubmissionById(input);
        if (!submission) throw new Error("Submission not found");

        // A submission that requested featured placement must have a completed
        // payment before it can be approved as featured — otherwise an admin
        // could grant paid placement for free.
        if (submission.isFeatured && submission.paymentStatus !== "completed") {
          throw new Error("Cannot approve as featured: payment has not been completed for this submission");
        }

        const isFeatured = !!submission.isFeatured;
        const durationDays = 30;
        const now = new Date();
        const featuredUntil = isFeatured ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000) : undefined;

        const slug = submission.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const createdTool = await createTool({
          name: submission.name,
          slug: slug,
          description: submission.description,
          categoryId: submission.categoryId,
          tags: submission.tags,
          pricingType: submission.pricingType,
          websiteUrl: submission.websiteUrl,
          affiliateUrl: submission.affiliateUrl,
          isFeatured: isFeatured ? "featured" : "none",
          featuredUntil: featuredUntil,
          isApproved: 1,
        });

        if (isFeatured && createdTool.insertId && submission.stripePaymentId) {
          await createFeaturedListing({
            toolId: createdTool.insertId,
            submissionId: submission.id,
            stripePaymentId: submission.stripePaymentId,
            amount: 9900,
            currency: "USD",
            durationDays: durationDays,
            startDate: now,
            endDate: featuredUntil,
          });
        }

        return await updateSubmission(input, { status: "approved" });
      }),
    rejectSubmission: adminProcedure
      .input(z.object({
        id: z.number(),
        reason: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await updateSubmission(input.id, { status: "rejected", rejectionReason: input.reason });
      }),
  }),

  paypalCheckout: router({
    createOrder: publicProcedure
      .input(z.object({
        submissionId: z.number(),
        toolName: z.string(),
        submitterEmail: z.string().email(),
        submitterName: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createOrder } = await import("./paypal-checkout");
        const returnUrl = ctx.req.headers.origin || "https://aitoolsdir-kouu5vxf.manus.space";
        const order = await createOrder(
          input.toolName,
          input.submitterEmail,
          input.submissionId,
          returnUrl
        );
        return { 
          orderId: order.id,
          approvalLink: order.links?.find((link: any) => link.rel === "approve")?.href 
        };
      }),
    captureOrder: publicProcedure
      .input(z.object({
        orderId: z.string(),
        submissionId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { captureOrder } = await import("./paypal-checkout");
        const { updateSubmission } = await import("./db");
        
        const result = await captureOrder(input.orderId);
        
        if (result.status === "COMPLETED") {
          await updateSubmission(input.submissionId, {
            paymentStatus: "completed",
            stripePaymentId: input.orderId,
          });
          return { success: true, status: result.status };
        }
        
        return { success: false, status: result.status };
      }),
  }),
});

export type AppRouter = typeof appRouter;
