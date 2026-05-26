import { GraphQLClient } from 'graphql-request';
import { env } from '@/shared/config/env';

// graphql-request v7 calls `new URL(url)` internally — fails on relative paths like "/graphql".
// Resolve to an absolute URL so dev-proxy (same-origin via vite) still works.
const gqlUrl = /^https?:\/\//.test(env.VITE_GRAPHQL_URL)
  ? env.VITE_GRAPHQL_URL
  : `${window.location.origin}${env.VITE_GRAPHQL_URL.startsWith('/') ? '' : '/'}${env.VITE_GRAPHQL_URL}`;

// Single GraphQL client. `credentials: 'include'` is critical — backend uses session cookies.
export const gqlClient = new GraphQLClient(gqlUrl, {
  credentials: 'include',
  // Throw rich errors so TanStack Query can show real messages, not "Network error".
  errorPolicy: 'none',
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
});

export class GqlError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'GqlError';
  }
}

export async function gqlRequest<TData, TVars extends Record<string, unknown> = Record<string, never>>(
  query: string,
  variables?: TVars,
): Promise<TData> {
  try {
    // graphql-request v7 has a generic mismatch when variables are optional; the cast is safe at runtime.
    return await gqlClient.request<TData>(query, variables as Record<string, unknown>);
  } catch (err: unknown) {
    // graphql-request throws ClientError with a populated errors array.
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const response = (err as { response?: { errors?: Array<{ message: string; extensions?: Record<string, unknown> }> } }).response;
      const first = response?.errors?.[0];
      throw new GqlError(
        first?.message ?? 'GraphQL request failed',
        (first?.extensions?.code as string | undefined) ?? undefined,
        err,
      );
    }
    throw new GqlError(err instanceof Error ? err.message : 'Network error', undefined, err);
  }
}
