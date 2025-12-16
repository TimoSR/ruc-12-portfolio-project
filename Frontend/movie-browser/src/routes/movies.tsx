import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout";
import { MovieListView, MovieDetailsView } from "../features/Chris/movies";
import { movieListQueryOptions, movieDetailsQueryOptions } from "../api/queries/movieQueries";

export type movieSearch = {
    query: string;
    page: number;
    pageSize: number;
};

export const movieListRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/movies',

    validateSearch: (search: Record<string, unknown>): movieSearch => {
        return {
            query: (search.query as string) || '',
            page: Number(search.page) || 1,
            pageSize: Number(search.pageSize) || 20,
        };
    },

    loaderDeps: ({ search }) => search,

    loader: ({ context: { queryClient }, deps: searchParams }) => {
        return queryClient.ensureQueryData(movieListQueryOptions(searchParams));
    },

    component: MovieListView,
});

export const movieDetailsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/movies/$movieId',
    loader: ({ context: { queryClient }, params: { movieId } }) => {
        return queryClient.ensureQueryData(movieDetailsQueryOptions(movieId));
    },
    component: MovieDetailsView,
});
