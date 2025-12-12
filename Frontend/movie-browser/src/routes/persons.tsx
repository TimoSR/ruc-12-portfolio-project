import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout"; // Import Parent
import { PersonListPage } from "../pages/PersonListPage";
import { PersonDetailsPage } from "../pages/PersonDetailsPage";
import { personListQueryOptions } from "../api/queries/personQueries";

// Export this type so it can be used in your components if needed
export type personSearch = {
  query: string;
  page: number;
  pageSize: number;
};

export const personListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/persons',
  
  validateSearch: (search: Record<string, unknown>): personSearch => {
    return {
      query: (search.query as string) || '',
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 20,
    };
  },

  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps: searchParams }) => {
    return queryClient.ensureQueryData(personListQueryOptions(searchParams));
  },

  component: PersonListPage,
});

export const personDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/persons/$personId',
  component: PersonDetailsPage,
});