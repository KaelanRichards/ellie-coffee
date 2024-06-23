import { createCallerFactory, router } from '../trpc';
import { roastLogRouter } from './roastLogRouter';
import { roastProfileRouter } from './roastProfileRouter';
import { greenBeanRouter } from './greenBeanRouter';
import { cuppingNoteRouter } from './cuppingNoteRouter';
import { experimentRouter } from './experimentRouter';
import { equipmentRouter } from './equipmentRouter';
import { batchPlanningRouter } from './batchPlanningRouter';

export const appRouter = router({
  roastLog: roastLogRouter,
  roastProfile: roastProfileRouter,
  greenBean: greenBeanRouter,
  cuppingNote: cuppingNoteRouter,
  experiment: experimentRouter,
  equipment: equipmentRouter,
  batchPlanning: batchPlanningRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
