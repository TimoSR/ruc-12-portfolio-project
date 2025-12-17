import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout";
import { MovieListView, MovieDetailsView } from "../features/Chris/movies";
import {
  movieListQueryOptions,
  movieDetailsQueryOptions,
} from "../api/queries/movieQueries";

export const MOVIE_DEFAULTS = {
  page: 1,
  pageSize: 24,
  query: "",
} as const;

export type MovieSearch = {
  query: string;
  page: number;
  pageSize: number;
};

export const movieListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/movies",

  validateSearch: (search: Record<string, unknown>): MovieSearch => {
    return {
      query: (search.query as string) || MOVIE_DEFAULTS.query,
      page: Number(search.page) || MOVIE_DEFAULTS.page,
      pageSize: Number(search.pageSize) || MOVIE_DEFAULTS.pageSize,
    };
  },

  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(movieListQueryOptions(deps));
  },

  component: MovieListView,
});

export const movieDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/movies/$movieId",

  // ✅ Keep the same URL search contract as /movies
  validateSearch: (search: Record<string, unknown>): MovieSearch => {
    return {
      query: (search.query as string) || MOVIE_DEFAULTS.query,
      page: Number(search.page) || MOVIE_DEFAULTS.page,
      pageSize: Number(search.pageSize) || MOVIE_DEFAULTS.pageSize,
    };
  },

  loader: ({ context: { queryClient }, params }) => {
    const movieId = String(params.movieId ?? "").trim();
    if (!movieId) {
      throw new Error("Missing required route param: movieId");
    }

    return queryClient.ensureQueryData(movieDetailsQueryOptions(movieId));
  },

  component: MovieDetailsView,
});
