import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '../../../../api/client'

export interface IRatingStore {
    userRating: number | null
    isLoading: boolean
    error: string | null
    rateMovie(accountId: string, movieId: string, rating: number): Promise<void>
    fetchUserRating(accountId: string, movieId: string): Promise<void>
}

export class RatingStore implements IRatingStore {
    userRating: number | null = null
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async rateMovie(accountId: string, movieId: string, rating: number): Promise<void> {
        this.isLoading = true
        this.error = null
        try {
            await apiClient(`/accounts/${accountId}/ratings`, {
                method: 'POST',
                body: JSON.stringify({ titleId: movieId, score: rating }),
            })
            runInAction(() => {
                this.userRating = rating
                this.isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Failed to rate movie'
                this.isLoading = false
            })
        }
    }

    async fetchUserRating(accountId: string, movieId: string): Promise<void> {
        this.isLoading = true
        try {
            // Fetch all ratings for the user and find the one for this movie
            const ratings = await apiClient(`/accounts/${accountId}/ratings`) as Array<{ titleId: string, score: number }>

            const userRating = ratings.find(r => r.titleId === movieId)

            runInAction(() => {
                this.userRating = userRating ? userRating.score : null
                this.isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                this.userRating = null
                this.isLoading = false
            })
        }
    }
}
