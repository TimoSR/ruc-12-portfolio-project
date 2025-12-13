import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '../client';

type MovieSearchParams = {
    query: string;
    page: number;
    pageSize: number;
};

export const movieListQueryOptions = (params: MovieSearchParams) => {
    return queryOptions({
        queryKey: ['titles', params],
        queryFn: () => {
            const searchParams = new URLSearchParams({
                query: params.query,
                page: params.page.toString(),
                pageSize: params.pageSize.toString(),
            });

            return apiClient(`/titles?${searchParams.toString()}`);
        },
    });
};

export const movieDetailsQueryOptions = (movieId: string) => {
    return queryOptions({
        queryKey: ['titles', movieId],
        queryFn: () => apiClient(`/titles/${movieId}`),
    });
};
