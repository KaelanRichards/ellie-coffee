import { createCallerFactory, router } from '../trpc';
import { roastLogRouter } from './roastLogRouter';
import { roastProfileRouter } from './roastProfileRouter';
import { greenBeanRouter } from './greenBeanRouter';
import { cuppingNoteRouter } from './cuppingNoteRouter';
import { experimentRouter } from './experimentRouter';
import { equipmentRouter } from './equipmentRouter';

export const appRouter = router({
  roastLog: roastLogRouter,
  roastProfile: roastProfileRouter,
  greenBean: greenBeanRouter,
  cuppingNote: cuppingNoteRouter,
  experiment: experimentRouter,
  equipment: equipmentRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
