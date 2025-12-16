import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout"; // Import Parent
import { PersonListPage } from "../pages/PersonListPage";
import { PersonDetailsPage } from "../pages/PersonDetailsPage";
import { personListQueryOptions } from "../api/queries/personQueries";

// 1. Define Defaults ONCE
export const PERSON_DEFAULTS = {
  page: 1,
  pageSize: 24,
  query: '',
} as const; // 'as const' makes these read-only values

export type PersonSearch = {
  query: string;
  page: number;
  pageSize: number;
};

export const personListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/persons',
  
  validateSearch: (search: Record<string, unknown>): PersonSearch => {
    return {
      query: (search.query as string) || PERSON_DEFAULTS.query,
      page: Number(search.page) || PERSON_DEFAULTS.page,
      // Now this is the ONLY place that decides "24" is the fallback
      pageSize: Number(search.pageSize) || PERSON_DEFAULTS.pageSize,
    };
  },

  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(personListQueryOptions(deps));
  },

  component: PersonListPage,
});

export const personDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/persons/$personId',
  component: PersonDetailsPage,
});