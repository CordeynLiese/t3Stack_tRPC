import { createTRPCRouter } from "@/server/api/trpc";
import { trainingsRouter } from "./routers/training";
import { domainsRouter } from "./routers/domain";
import { bookingsRouter } from "./routers/booking";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trainings: trainingsRouter,
  domains: domainsRouter,
  bookings: bookingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
