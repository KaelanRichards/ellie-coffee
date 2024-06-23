import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { Prisma } from '@prisma/client';

const defaultGreenBeanSelect = {
  id: true,
  origin: true,
  variety: true,
  processingMethod: true,
  quantity: true,
  purchaseDate: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.GreenBeanSelect;

export const greenBeanRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.greenBean.findMany({
      select: defaultGreenBeanSelect,
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.greenBean.findUnique({
        where: { id: input.id },
        select: defaultGreenBeanSelect,
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        origin: z.string(),
        variety: z.string(),
        processingMethod: z.string(),
        quantity: z.number(),
        purchaseDate: z.date(),
      }),
    )
    .mutation(({ input }) => {
      return prisma.greenBean.create({
        data: input,
        select: defaultGreenBeanSelect,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        origin: z.string(),
        variety: z.string(),
        processingMethod: z.string(),
        quantity: z.number(),
        purchaseDate: z.date(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.greenBean.update({
        where: { id },
        data,
        select: defaultGreenBeanSelect,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.greenBean.delete({
        where: { id: input.id },
        select: defaultGreenBeanSelect,
      });
    }),
  getLowStock: publicProcedure
    .input(z.object({ threshold: z.number() }))
    .query(async ({ input }) => {
      return prisma.greenBean.findMany({
        where: {
          quantity: {
            lte: input.threshold,
          },
        },
        orderBy: { quantity: 'asc' },
      });
    }),

  getTotalCount: publicProcedure.query(async () => {
    return prisma.greenBean.count();
  }),
});
