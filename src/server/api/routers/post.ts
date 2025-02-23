import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // ✅ Create a new user (instead of post)
  create: publicProcedure
    .input(
      z.object({
        emailAddress: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.create({
        data: {
          emailAddress: input.emailAddress,
          firstName: input.firstName,
          lastName: input.lastName,
          imageUrl: input.imageUrl || "",
        },
      });
    }),

  // ✅ Fetch the latest user (instead of latest post)
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      orderBy: { id: "desc" },
    });

    return user ?? null;
  }),
});
