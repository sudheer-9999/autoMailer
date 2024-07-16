import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import jwt from "jsonwebtoken";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";

type CreateContextOptions = Record<string, never>;

export const createContext = ({ req, res }: CreateNextContextOptions) => {
  const token = req.cookies.accessToken;

  const decodedValues: any = jwt.decode(req.cookies?.accessToken!);

  const userId: string = decodedValues?.["x-user-id"];

  return {
    db,
    req,
    res,
    userId,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
