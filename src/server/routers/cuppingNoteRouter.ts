import { router, publicProcedure } from '../trpc';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Default selector for CuppingNote.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
const defaultCuppingNoteSelect = {
  id: true,
  roastLogId: true,
  aroma: true,
  flavor: true,
  aftertaste: true,
  acidity: true,
  body: true,
  balance: true,
  overall: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  roastLog: {
    select: {
      id: true,
      date: true,
      beanType: true,
    },
  },
} satisfies Prisma.CuppingNoteSelect;

export const cuppingNoteRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.cuppingNote.findMany({
      select: defaultCuppingNoteSelect,
    });
  }),
  getByRoastLogId: publicProcedure
    .input(z.object({ roastLogId: z.string() }))
    .query(({ input }) => {
      return prisma.cuppingNote.findMany({
        where: { roastLogId: input.roastLogId },
        select: defaultCuppingNoteSelect,
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        roastLogId: z.string(),
        aroma: z.number().min(0).max(10),
        flavor: z.number().min(0).max(10),
        aftertaste: z.number().min(0).max(10),
        acidity: z.number().min(0).max(10),
        body: z.number().min(0).max(10),
        balance: z.number().min(0).max(10),
        overall: z.number().min(0).max(10),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      return prisma.cuppingNote.create({
        data: input,
        select: defaultCuppingNoteSelect,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        aroma: z.number().min(0).max(10),
        flavor: z.number().min(0).max(10),
        aftertaste: z.number().min(0).max(10),
        acidity: z.number().min(0).max(10),
        body: z.number().min(0).max(10),
        balance: z.number().min(0).max(10),
        overall: z.number().min(0).max(10),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.cuppingNote.update({
        where: { id },
        data,
        select: defaultCuppingNoteSelect,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.cuppingNote.delete({
        where: { id: input.id },
        select: defaultCuppingNoteSelect,
      });
    }),
});
