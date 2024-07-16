import { TRPCError } from "@trpc/server";
import { deleteCookie, setCookie } from "cookies-next";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { compare, sign } from "~/utils";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx: { db, req, res } }) => {
      const { email, password } = input;

      const user = await db.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      const notFoundError = new TRPCError({
        code: "NOT_FOUND",
        message: "Invalid Email or Password",
      });

      if (!user) return notFoundError;

      if (!compare(password, user.password)) {
        throw notFoundError;
      }

      const claims = {
        "x-user-id": user?.id,
      };
      const accessToken = sign(claims);

      setCookie("accessToken", accessToken, { req: req, res: res });

      return { accessToken };
    }),
  logout: publicProcedure.mutation(async ({ input, ctx: { db, req, res } }) => {
    deleteCookie("accessToken", { req: req, res: res });
    return "Success";
  }),
});
