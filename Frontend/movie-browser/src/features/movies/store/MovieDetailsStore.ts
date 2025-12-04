import { makeAutoObservable, runInAction } from 'mobx'
import type { MovieItem } from '../types'

export interface IMovieDetailsStore {
    movie: MovieItem | null
    isLoading: boolean
    error: string | null

    loadMovie(id: string): Promise<void>
}

export class MovieDetailsStore implements IMovieDetailsStore {
    movie: MovieItem | null = null
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async loadMovie(id: string): Promise<void> {
        this.isLoading = true
        this.error = null

        try {
            const movie = await this.fetchMovie(id)

            runInAction(() => {
                this.movie = movie
                this.isLoading = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Movie not found'

            runInAction(() => {
                this.error = message
                this.movie = null
                this.isLoading = false
            })

            throw error
        }
    }

    private async fetchMovie(id: string): Promise<MovieItem> {
        await new Promise(resolve => setTimeout(resolve, 400))

        return {
            id,
            titleType: 'movie',
            primaryTitle: `Movie Details for ${id}`,
            originalTitle: 'Original Title',
            isAdult: false,
            startYear: 2023,
            endYear: null,
            runtimeMinutes: 120,
            posterUrl: null,
            plot: 'This is a detailed plot description for the movie. It contains multiple sentences describing the story, characters, and themes of the film.',
            url: null
        }
    }
}
