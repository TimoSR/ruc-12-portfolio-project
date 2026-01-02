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

// Simplified type for the mutation payload
type RateMoviePayload = {
    rating: number;
}

export const rateMovieMutation = (movieId: string, userId: string) => {
    // In React Query v5, we often just use the useMutation hook directly in components,
    // or return the config object here. Since we are using standard patterns,
    // let's just export the function that performs the request so useMutation can call it.
    return (payload: RateMoviePayload) => apiClient(`/accounts/${userId}/ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, titleId: movieId, score: payload.rating, comment: '' })
    });
};

export const userRatingQueryOptions = (movieId: string, userId: string | null) => {
    return queryOptions({
        queryKey: ['userRating', movieId, userId],
        queryFn: async () => {
            if (!userId) return null;
            const response = await fetch(`http://localhost:5001/api/v1/accounts/${userId}/ratings/title/${movieId}`);
            if (response.status === 204) return null; // No rating found
            if (!response.ok) return null;
            return response.json();
        },
        enabled: !!userId, // Only run if user is logged in
    });
};
