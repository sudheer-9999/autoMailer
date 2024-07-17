import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { mailRouter } from "./routers/mail";
import { scriptsRouter } from "./routers/script";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
  mail: mailRouter,
  script: scriptsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
