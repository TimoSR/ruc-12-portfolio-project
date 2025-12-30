// @ts-nocheck
import { makeAutoObservable } from 'mobx';

/**
 * @fileoverview MobX store for managing title ratings.
 * Implements requirement 3-E.5 (Rating titles).
 */
export class RatingStore {
    isLoading = false;
    error = null;

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
}

export const ratingStore = new RatingStore();
