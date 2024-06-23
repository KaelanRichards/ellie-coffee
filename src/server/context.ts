/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as trpcNext from '@trpc/server/adapters/next';

interface CreateContextOptions {
  session: { userId: string } | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(opts: CreateContextOptions) {
  return {
    session: opts.session,
  };
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  // Here you would normally get the session from a cookie or header
  const session = { userId: 'mock-user-id' }; // Replace this with actual session retrieval logic
  return await createContextInner({ session });
}
