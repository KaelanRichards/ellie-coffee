import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const defaultRoastLogSelect = {
  id: true,
  date: true,
  beanType: true,
  profileId: true,
  equipment: true,
  notes: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  weight: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  profile: {
    select: {
      id: true,
      name: true,
    },
  },
  cuppingNotes: {
    select: {
      id: true,
      aroma: true,
      flavor: true,
      aftertaste: true,
      acidity: true,
      body: true,
      balance: true,
      overall: true,
      notes: true,
    },
  },
} satisfies Prisma.RoastLogSelect;

export const roastLogRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.roastLog.findMany({
      select: defaultRoastLogSelect,
    });
  }),
  getRecent: publicProcedure.query(() => {
    return prisma.roastLog.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      select: defaultRoastLogSelect,
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        date: z.date(),
        beanType: z.string(),
        profileId: z.string(),
        equipment: z.string(),
        notes: z.string().optional(),
        weight: z.number().optional(), // Added weight field
      }),
    )
    .mutation(({ input, ctx }) => {
      if (!ctx.session) {
        throw new Error('Not authenticated');
      }
      return prisma.roastLog.create({
        data: {
          ...input,
          userId: ctx.session.userId,
        },
        select: defaultRoastLogSelect,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
        beanType: z.string(),
        profileId: z.string(),
        equipment: z.string(),
        notes: z.string().optional(),
        weight: z.number().optional(), // Added weight field
      }),
    )
    .mutation(async ({ input }) => {
      const roastLog = await prisma.roastLog.update({
        where: { id: input.id },
        data: {
          date: input.date,
          beanType: input.beanType,
          profileId: input.profileId,
          equipment: input.equipment,
          notes: input.notes,
          weight: input.weight, // Added weight field
        },
        select: defaultRoastLogSelect,
      });
      return roastLog;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.roastLog.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const roastLog = await prisma.roastLog.findUnique({
        where: { id: input.id },
        select: defaultRoastLogSelect,
      });
      if (!roastLog) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Roast log not found',
        });
      }
      return roastLog;
    }),

  getUpcoming: publicProcedure.query(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prisma.roastLog.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
      select: defaultRoastLogSelect,
    });
  }),

  getTotalCount: publicProcedure.query(async () => {
    return prisma.roastLog.count();
  }),
});
