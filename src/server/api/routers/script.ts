import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { compare, hash, sign } from "~/utils";
import { runScripts } from "~/utils/scripts/mails";

export const scriptsRouter = createTRPCRouter({
  run: publicProcedure.mutation(async ({ input, ctx: { db, req, res } }) => {
    await runScripts();

    return {};
  }),
});
