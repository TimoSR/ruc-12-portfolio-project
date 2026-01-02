// @ts-nocheck
import { makeAutoObservable } from 'mobx';

/**
 * @fileoverview MobX store for managing title ratings.
 * Implements requirement 3-E.5 (Rating titles).
 */
export class RatingStore {
    isLoading = false;
    error = null;
    /** @type {Array<{tconst: string, rating: number, timestamp: string}>} */
    ratings = [];

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Rate a title (movie).
     * @param {string} userId
     * @param {string} tconst
     * @param {number} rating - Integer 1-10
     */
    async rateTitle(userId, tconst, rating) {
        if (!userId) {
            this.error = "User not logged in";
            return;
        }

        this.isLoading = true;
        this.error = null;

        try {
            // MOCK DELAY
            await new Promise(resolve => setTimeout(resolve, 600));

            // Mock API: POST /api/v1/titles/rate
            console.log(`User ${userId} rated ${tconst} with ${rating} stars`);

            // In a real app, we might update a local cache of ratings here
        } catch (err) {
            console.error("Rating failed", err);
            this.error = "Failed to submit rating";
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Fetches all ratings made by the user.
     * @param {string} userId
     */
    async fetchUserRatings(userId) {
        if (!userId) return;

        this.isLoading = true;
        try {
            await new Promise(r => setTimeout(r, 500)); // Mock delay

            // Mock data - normally GET /api/v1/ratings
            this.ratings = [
                { tconst: 'tt0110912', rating: 9, timestamp: new Date().toISOString() },
                { tconst: 'tt0068646', rating: 10, timestamp: new Date(Date.now() - 86400000).toISOString() }
            ];

        } catch (err) {
            console.error("Failed to fetch user ratings", err);
        } finally {
            this.isLoading = false;
        }
    }
}

export const ratingStore = new RatingStore();
