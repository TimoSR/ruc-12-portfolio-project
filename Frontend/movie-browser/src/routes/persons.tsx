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
  query?: string;
  page?: number;
  pageSize?: number;
};

export const personListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/persons',

  validateSearch: (search: Record<string, unknown>): PersonSearch => {
    // Only return values that are different from defaults
    const result: PersonSearch = {};

    if (search.query && String(search.query) !== PERSON_DEFAULTS.query) {
      result.query = String(search.query);
    }

    // Parse page, only keep if > 1 (assuming default is 1)
    const page = Number(search.page);
    if (page && page !== PERSON_DEFAULTS.page) {
      result.page = page;
    }

    // Parse pageSize, only keep if != default
    const pageSize = Number(search.pageSize);
    if (pageSize && pageSize !== PERSON_DEFAULTS.pageSize) {
      result.pageSize = pageSize;
    }

    return result;
  },

  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps }) => {
    // Apply defaults here for the actual query
    const queryParams = {
      query: deps.query ?? PERSON_DEFAULTS.query,
      page: deps.page ?? PERSON_DEFAULTS.page,
      pageSize: deps.pageSize ?? PERSON_DEFAULTS.pageSize,
    };
    return queryClient.ensureQueryData(personListQueryOptions(queryParams));
  },

  component: PersonListPage,
});

export const personDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/persons/$personId',
  component: PersonDetailsPage,
});