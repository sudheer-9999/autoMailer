import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { compare, hash, sign } from "~/utils";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
        resume: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { db, req, res } }) => {
      const { email, name, password, resume } = input;

      const hashedPassword = hash(password);

      const userPresent = await db.user.findUnique({ where: { email: email } });

      if (userPresent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You have already registered. Please Login",
        });
      }
      const createdUser = await db.user.create({
        data: { email, name, password: hashedPassword, resume: resume || "" },
      });

      return createdUser;
    }),
});
