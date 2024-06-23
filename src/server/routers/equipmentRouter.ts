import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { Prisma } from '@prisma/client';

const defaultEquipmentSelect = {
  id: true,
  name: true,
  type: true,
  manufacturer: true,
  model: true,
  serialNumber: true,
  purchaseDate: true,
  lastMaintenance: true,
  nextMaintenance: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EquipmentSelect;

export const equipmentRouter = router({
  getAll: publicProcedure.query(() => {
    return prisma.equipment.findMany({
      select: defaultEquipmentSelect,
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.equipment.findUnique({
        where: { id: input.id },
        select: defaultEquipmentSelect,
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        manufacturer: z.string(),
        model: z.string(),
        serialNumber: z.string().optional(),
        purchaseDate: z.date(),
        lastMaintenance: z.date().optional(),
        nextMaintenance: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      return prisma.equipment.create({
        data: input,
        select: defaultEquipmentSelect,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        manufacturer: z.string(),
        model: z.string(),
        serialNumber: z.string().optional(),
        purchaseDate: z.date(),
        lastMaintenance: z.date().optional(),
        nextMaintenance: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.equipment.update({
        where: { id },
        data,
        select: defaultEquipmentSelect,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.equipment.delete({
        where: { id: input.id },
        select: defaultEquipmentSelect,
      });
    }),
});
