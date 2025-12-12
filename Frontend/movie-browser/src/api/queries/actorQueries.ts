// src/queries/actorQueries.ts
import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '../client';

// Define the shape of your parameters
type ActorSearchParams = {
  query: string;
  page: number;
  pageSize: number;
};

// This is now a FUNCTION that returns the options
export const actorListQueryOptions = (params: ActorSearchParams) => {
  return queryOptions({
    // 1) Unique key: include params so the cache knows page 1 != page 2
    queryKey: ['actors', params],

    // 2) Fetcher: builds the dynamic URL safely
    queryFn: () => {
      // Create a clean query string safely
      const searchParams = new URLSearchParams({
        query: params.query,
        page: params.page.toString(),
        pageSize: params.pageSize.toString(),
      });

      return apiClient(`/titles?${searchParams.toString()}`);
    },
  });
};
