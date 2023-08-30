import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const domains = [
  {
    id: 0,
    name: ".NET",
  },
  {
    id: 1,
    name: "Javascript",
  },
  {
    id: 2,
    name: "Professional skills",
  },
  {
    id: 3,
    name: "Azure",
  },
];

export const domainsRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return domains;
  }),
});
