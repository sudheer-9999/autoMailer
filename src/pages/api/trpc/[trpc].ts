import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter } from "~/server/api/root";
import { createContext } from "~/server/api/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
});
