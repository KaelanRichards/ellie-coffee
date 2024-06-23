import { createCallerFactory, router } from '../trpc';
import { roastLogRouter } from './roastLogRouter';
import { roastProfileRouter } from './roastProfileRouter';
import { greenBeanRouter } from './greenBeanRouter';
import { cuppingNoteRouter } from './cuppingNoteRouter';

export const appRouter = router({
  roastLog: roastLogRouter,
  roastProfile: roastProfileRouter,
  greenBean: greenBeanRouter,
  cuppingNote: cuppingNoteRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
