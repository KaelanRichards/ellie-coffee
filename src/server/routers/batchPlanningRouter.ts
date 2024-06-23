import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

const defaultBatchPlanSelect = {
  id: true,
  scheduledDate: true,
  roastProfileId: true,
  greenBeanId: true,
  batchSize: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BatchPlanSelect;

export const batchPlanningRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.batchPlan.findMany({
      include: {
        roastProfile: true,
        greenBean: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        scheduledDate: z.date(),
        roastProfileId: z.string(),
        greenBeanId: z.string(),
        batchSize: z.number(),
      }),
    )
    .mutation(({ input }) => {
      return prisma.batchPlan.create({
        data: input,
        select: defaultBatchPlanSelect,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.batchPlan.delete({
        where: { id: input.id },
        select: defaultBatchPlanSelect,
      });
    }),

  calculateGreenBeanRequirement: publicProcedure
    .input(z.object({ batchPlanId: z.string() }))
    .query(async ({ input }) => {
      const batchPlan = await prisma.batchPlan.findUnique({
        where: { id: input.batchPlanId },
        include: { greenBean: true },
      });

      if (!batchPlan) {
        throw new Error('Batch plan not found');
      }

      const requiredAmount = batchPlan.batchSize * 1.2; // Assuming 20% loss during roasting
      const availableAmount = batchPlan.greenBean.quantity;

      return {
        required: requiredAmount,
        available: availableAmount,
        sufficient: availableAmount >= requiredAmount,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.batchPlan.findUnique({
        where: { id: input.id },
        include: {
          roastProfile: true,
          greenBean: true,
        },
      });
    }),
});
