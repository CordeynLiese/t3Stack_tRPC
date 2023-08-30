import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";

let bookings = [
  {
    id: "1",
    trainingId: "20",
    status: "Added",
    comments: [{ date: new Date(), comment: "Added by you" }],
    selectedTrainingOptions: ["2"],
  },
  {
    id: "5",
    trainingId: "2",
    status: "Requested",
    motivation: "I really want this",
    comments: [{ date: new Date(), comment: "Added by you" }],
    selectedTrainingOptions: ["2"],
  },
  {
    id: "1",
    trainingId: "10",
    status: "Added",
    comments: [{ date: new Date(), comment: "Added by you" }],
  },
];

export const bookingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return bookings;
  }),

  addBooking: publicProcedure
    .input(
      z.object({
        trainingId: z.string(),
        selectedTrainingOptions: z.array(z.string()).optional(),
      }),
    )
    .mutation(({ input }) => {
      const newBooking = {
        ...input,
        id: faker.string.uuid(),
        comments: [{ date: new Date(), comment: "Added by you" }],
        status: "Added",
        motivation: undefined,
      };

      bookings.push(newBooking);
      return newBooking;
    }),

  requestBooking: publicProcedure
    .input(
      z.object({
        bookingId: z.string(),
        selectedTrainingOptions: z.array(z.string()),
        motivation: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const booking = bookings.find((x) => (x.id = input.bookingId));
      console.log(booking);
      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Training not found",
        });
      }

      const updatedBooking = {
        ...booking,
        selectedTrainingOptions: input.selectedTrainingOptions,
        motivation: input.motivation,
        comments: [
          ...booking.comments,
          { date: new Date(), comment: "Requested by you" },
        ],
        status: "pending-approval",
      };

      bookings = bookings.map((x) =>
        x.id === input.bookingId ? updatedBooking : x,
      );

      return updatedBooking;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const booking = bookings.find((x) => x.id === input.id);
      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Training not found",
        });
      }

      return booking;
    }),
});
