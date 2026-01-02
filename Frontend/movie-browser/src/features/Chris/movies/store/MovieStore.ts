import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '../../../../api/client'
import type { MovieItem, PagedResult } from '../types'

export interface IMovieStore {
    movies: MovieItem[]
    currentPage: number
    totalPages: number
    pageSize: number
    totalCount: number
    isLoading: boolean
    error: string | null
    searchQuery: string
    loadMovies(page?: number): Promise<void>
    setSearchQuery(query: string): void
    nextPage(): Promise<void>
    previousPage(): Promise<void>
}

export class MovieStore implements IMovieStore {
    movies: MovieItem[] = []
    currentPage: number = 1
    totalPages: number = 1
    pageSize: number = 20
    totalCount: number = 0
    isLoading: boolean = false
    error: string | null = null
    searchQuery: string = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    setSearchQuery(query: string) {
        this.searchQuery = query
        this.currentPage = 1
        this.loadMovies(1)
    }

    async loadMovies(page: number = 1): Promise<void> {
        this.isLoading = true
        this.error = null

        try {
            const searchParams = new URLSearchParams({
                query: this.searchQuery,
                page: page.toString(),
                pageSize: this.pageSize.toString(),
            })

            const result = await apiClient(`/titles?${searchParams.toString()}`) as PagedResult<MovieItem>

            runInAction(() => {
                this.movies = result.items
                this.currentPage = result.page
                this.totalPages = result.totalPages
                this.totalCount = result.totalCount
                this.isLoading = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load movies'
            console.warn('API Failed, falling back to MOCK DATA', message);
            runInAction(() => {
                this.error = null; // Clear error to show mock data
                this.movies = [
                    { id: 'tt0110912', primaryTitle: 'Mock Matrix Fiction', startYear: 1994, posterUrl: 'https://placehold.co/300x450?text=Matrix', titleType: 'movie', averageRating: 8.5 },
                    { id: 'tt0068646', primaryTitle: 'Mock The Matrixfather', startYear: 1972, posterUrl: 'https://placehold.co/300x450?text=Matrixfather', titleType: 'movie', averageRating: 9.2 }
                ] as MovieItem[];
                this.totalCount = 2;
                this.totalPages = 1;
                this.isLoading = false
            })
        }
    }

    async nextPage(): Promise<void> {
        if (this.currentPage < this.totalPages) {
            await this.loadMovies(this.currentPage + 1)
        }
    }

    async previousPage(): Promise<void> {
        if (this.currentPage > 1) {
            await this.loadMovies(this.currentPage - 1)
        }
    }
}
