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
  query?: string;
  page?: number;
  pageSize?: number;
};

export const movieListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/movies",

  validateSearch: (search: Record<string, unknown>): MovieSearch => {
    const result: MovieSearch = {};

    if (search.query && String(search.query) !== MOVIE_DEFAULTS.query) {
      result.query = String(search.query);
    }

    const page = Number(search.page);
    if (page && page !== MOVIE_DEFAULTS.page) {
      result.page = page;
    }

    const pageSize = Number(search.pageSize);
    if (pageSize && pageSize !== MOVIE_DEFAULTS.pageSize) {
      result.pageSize = pageSize;
    }

    return result;
  },

  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps }) => {
    const queryParams = {
      query: deps.query ?? MOVIE_DEFAULTS.query,
      page: deps.page ?? MOVIE_DEFAULTS.page,
      pageSize: deps.pageSize ?? MOVIE_DEFAULTS.pageSize,
    };
    return queryClient.ensureQueryData(movieListQueryOptions(queryParams));
  },

  component: MovieListView,
});

export const movieDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/movies/$movieId",

  // ✅ Keep the same URL search contract as /movies
  validateSearch: (search: Record<string, unknown>): MovieSearch => {
    const result: MovieSearch = {};

    if (search.query && String(search.query) !== MOVIE_DEFAULTS.query) {
      result.query = String(search.query);
    }

    const page = Number(search.page);
    if (page && page !== MOVIE_DEFAULTS.page) {
      result.page = page;
    }

    const pageSize = Number(search.pageSize);
    if (pageSize && pageSize !== MOVIE_DEFAULTS.pageSize) {
      result.pageSize = pageSize;
    }

    return result;
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
