import { router, publicProcedure } from '../trpc';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const defaultRoastProfileSelect = {
  id: true,
  name: true,
  firstCrack: true,
  developmentTime: true,
  endTemperature: true,
  totalRoastTime: true,
  chargeTemperature: true,
  dryingPhaseEnd: true,
  firstCrackEnd: true,
  coolingStarted: true,
  airflowSettings: true,
  drumSpeed: true,
  heatSettings: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  temperatureReadings: {
    select: {
      time: true,
      temperature: true,
    },
  },
  notes: true,
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
        temperatureReadings: z.array(
          z.object({ time: z.number(), temperature: z.number() }),
        ),
        firstCrack: z.number().optional(),
        developmentTime: z.number().optional(),
        endTemperature: z.number().optional(),
        totalRoastTime: z.number().optional(),
        chargeTemperature: z.number().optional(),
        dryingPhaseEnd: z.number().optional(),
        firstCrackEnd: z.number().optional(),
        coolingStarted: z.number().optional(),
        airflowSettings: z
          .array(z.object({ time: z.number(), value: z.number() }))
          .optional(),
        drumSpeed: z.number().optional(),
        heatSettings: z
          .array(z.object({ time: z.number(), value: z.number() }))
          .optional(),
        notes: z.string().optional(), // Added this line
      }),
    )
    .mutation(({ input, ctx }) => {
      if (!ctx.session) {
        throw new Error('Not authenticated');
      }
      return prisma.roastProfile.create({
        data: {
          name: input.name,
          userId: ctx.session.userId,
          firstCrack: input.firstCrack,
          developmentTime: input.developmentTime,
          endTemperature: input.endTemperature,
          totalRoastTime: input.totalRoastTime,
          chargeTemperature: input.chargeTemperature,
          dryingPhaseEnd: input.dryingPhaseEnd,
          firstCrackEnd: input.firstCrackEnd,
          coolingStarted: input.coolingStarted,
          airflowSettings: input.airflowSettings,
          drumSpeed: input.drumSpeed,
          heatSettings: input.heatSettings,
          temperatureReadings: {
            createMany: { data: input.temperatureReadings },
          },
          notes: input.notes, // Added this line
        },
        select: defaultRoastProfileSelect,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        temperatureReadings: z.array(
          z.object({ time: z.number(), temperature: z.number() }),
        ),
        firstCrack: z.number().optional(),
        developmentTime: z.number().optional(),
        endTemperature: z.number().optional(),
        totalRoastTime: z.number().optional(),
        chargeTemperature: z.number().optional(),
        dryingPhaseEnd: z.number().optional(),
        firstCrackEnd: z.number().optional(),
        coolingStarted: z.number().optional(),
        airflowSettings: z
          .array(z.object({ time: z.number(), value: z.number() }))
          .optional(),
        drumSpeed: z.number().optional(),
        heatSettings: z
          .array(z.object({ time: z.number(), value: z.number() }))
          .optional(),
        notes: z.string().optional(), // Added this line
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.roastProfile.update({
        where: { id },
        data: {
          ...data,
          temperatureReadings: {
            deleteMany: {},
            createMany: {
              data: data.temperatureReadings,
            },
          },
          airflowSettings: data.airflowSettings
            ? {
                deleteMany: {},
                createMany: {
                  data: data.airflowSettings,
                },
              }
            : undefined,
          heatSettings: data.heatSettings
            ? {
                deleteMany: {},
                createMany: {
                  data: data.heatSettings,
                },
              }
            : undefined,
          notes: data.notes, // Added this line
        },
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
