import { makeAutoObservable, runInAction } from 'mobx'
import type { MovieItem, PagedResult } from '../types'

export interface IMovieStore {
    movies: MovieItem[]
    currentPage: number
    totalPages: number
    pageSize: number
    isLoading: boolean
    error: string | null

    loadMovies(page?: number): Promise<void>
    nextPage(): Promise<void>
    previousPage(): Promise<void>
}

export class MovieStore implements IMovieStore {
    movies: MovieItem[] = []
    currentPage: number = 1
    totalPages: number = 1
    pageSize: number = 20
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async loadMovies(page: number = 1): Promise<void> {
        this.isLoading = true
        this.error = null

        try {
            const result = await this.fetchMovies(page, this.pageSize)

            runInAction(() => {
                this.movies = result.items
                this.currentPage = result.page
                this.totalPages = result.totalPages
                this.isLoading = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'

            runInAction(() => {
                this.error = message
                this.movies = []
                this.isLoading = false
            })

            throw error
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

    private async fetchMovies(page: number, pageSize: number): Promise<PagedResult<MovieItem>> {
        await new Promise(resolve => setTimeout(resolve, 400))

        const mockMovies: MovieItem[] = Array.from({ length: pageSize }, (_, i) => ({
            id: `movie-${page}-${i}`,
            titleType: 'movie',
            primaryTitle: `Movie ${(page - 1) * pageSize + i + 1}`,
            originalTitle: null,
            isAdult: false,
            startYear: 2020 + (i % 5),
            endYear: null,
            runtimeMinutes: 90 + (i * 10),
            posterUrl: null,
            plot: `This is the plot for movie ${(page - 1) * pageSize + i + 1}. An exciting story awaits!`,
            url: null
        }))

        return {
            items: mockMovies,
            totalCount: 100,
            page,
            pageSize,
            totalPages: Math.ceil(100 / pageSize),
            hasNextPage: page < Math.ceil(100 / pageSize),
            hasPreviousPage: page > 1
        }
    }
}
