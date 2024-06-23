import { router, publicProcedure } from '../trpc';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const defaultRoastProfileSelect = {
  id: true,
  name: true,
  data: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RoastProfileSelect;

export const roastProfileRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.roastProfile.findMany({
      select: defaultRoastProfileSelect,
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.roastProfile.findUnique({
        where: { id: input.id },
        select: defaultRoastProfileSelect,
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        data: z.any(), // Remove .nullable()
      }),
    )
    .mutation(({ input, ctx }) => {
      if (!ctx.session) {
        throw new Error('Not authenticated');
      }
      return prisma.roastProfile.create({
        data: {
          ...input,
          userId: ctx.session.userId,
          data: input.data ?? null, // Provide a default value if input.data is undefined
        },
        select: defaultRoastProfileSelect,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        data: z.any(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.roastProfile.update({
        where: { id },
        data,
        select: defaultRoastProfileSelect,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.roastProfile.delete({
        where: { id: input.id },
        select: defaultRoastProfileSelect,
      });
    }),
});
