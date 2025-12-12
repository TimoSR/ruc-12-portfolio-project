import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout"; // Import Parent
import { ActorListPage } from "../pages/ActorListPage";
import { ActorDetailsPage } from "../pages/ActorDetailsPage";
import { actorListQueryOptions } from "../api/queries/actorQueries";

// Export this type so it can be used in your components if needed
export type ActorSearch = {
  query: string;
  page: number;
  pageSize: number;
};

export const actorListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/actors',
  
  validateSearch: (search: Record<string, unknown>): ActorSearch => {
    return {
      query: (search.query as string) || '',
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 20,
    };
  },

  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps: searchParams }) => {
    return queryClient.ensureQueryData(actorListQueryOptions(searchParams));
  },

  component: ActorListPage,
});

export const actorDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/actors/$actorId',
  component: ActorDetailsPage,
});