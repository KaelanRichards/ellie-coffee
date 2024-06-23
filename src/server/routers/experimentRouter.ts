import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { Prisma } from '@prisma/client';

const defaultExperimentSelect = {
  id: true,
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ExperimentSelect;

export const experimentRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.experiment.findMany({
      select: defaultExperimentSelect,
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.experiment.findUnique({
        where: { id: input.id },
        select: defaultExperimentSelect,
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
        status: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      return prisma.experiment.create({
        data: input,
        select: defaultExperimentSelect,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
        status: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.experiment.update({
        where: { id },
        data,
        select: defaultExperimentSelect,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.experiment.delete({
        where: { id: input.id },
        select: defaultExperimentSelect,
      });
    }),
});
