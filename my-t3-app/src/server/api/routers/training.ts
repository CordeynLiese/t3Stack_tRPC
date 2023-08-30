import { faker } from "@faker-js/faker";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

let count = 0;

function createRandomOptions() {
  count++;
  return {
    id: count - 1,
    startDate: faker.date.soon(),
    endDate: faker.date.soon(),
    name: faker.commerce.product(),
    deadline: faker.date.past(),
    credits: faker.number.int({ max: 100 }),
    description: faker.commerce.productDescription(),
  };
}

const options = faker.helpers.multiple(createRandomOptions, {
  count: 10,
});

function createRandomTraining() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.product(),
    startDate: faker.date.soon(),
    deadline: faker.date.soon(),
    credits: faker.number.int({ max: 100 }),
    domains: [Math.round(Math.random() * 3)],
    options: [Math.round(Math.random() * 9)],
  };
}

const trainings = faker.helpers.multiple(createRandomTraining, {
  count: 100,
});

export const trainingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return trainings;
  }),

  getAllPaged: publicProcedure
    .input(
      z.object({
        filters: z.object({
          domain: z.number().optional(),
        }),
        pageSize: z.number(),
        page: z.number(),
      }),
    )
    .query(({ input }) => {
      let filteredTrainings = trainings;

      const { domain } = input.filters;

      if (domain) {
        filteredTrainings = filteredTrainings.filter((x) =>
          x.domains.includes(domain),
        );
      }

      return {
        items: filteredTrainings.slice(
          input.page * input.pageSize,
          input.page * input.pageSize + input.pageSize,
        ),
        page: input.page,
        pageSize: input.pageSize,
        total: filteredTrainings.length,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const training = trainings.find((x) => x.id === input.id);
      if (!training) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Training not found",
        });
      }

      const availableOptions = training.options.map((x) => {
        return options[x];
      });

      return { ...training, options: availableOptions };
    }),
});
