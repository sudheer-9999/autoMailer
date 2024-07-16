import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { mailRouter } from "./routers/mail";

export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
  mail: mailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
