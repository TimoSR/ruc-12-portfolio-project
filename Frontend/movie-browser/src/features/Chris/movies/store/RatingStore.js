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
            // EPC: Using Real API v1
            const res = await fetch(`http://localhost:5001/api/v1/accounts/${userId}/ratings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titleId: tconst,
                    score: rating,
                    comment: ''
                })
            });

            if (!res.ok) {
                // If 409 Conflict, maybe we want to alert?
                throw new Error('Rating failed');
            }

            // Optionally refetch ratings or update locally
            // this.fetchUserRatings(userId); // Or just push to array

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
            // EPC: Using Real API v1
            const res = await fetch(`http://localhost:5001/api/v1/accounts/${userId}/ratings`);
            if (!res.ok) throw new Error('Failed to fetch ratings');

            const data = await res.json();

            // Map DTO { titleId, score, ... } to { tconst, rating, timestamp }
            this.ratings = data.map(r => ({
                tconst: r.titleId,
                rating: r.score,
                timestamp: new Date().toISOString() // DTO might not have timestamp? AccountRating has CreatedAt but RatingDto didn't have it?
            }));

        } catch (err) {
            console.error("Failed to fetch user ratings", err);
            this.error = "Could not load ratings";
        } finally {
            this.isLoading = false;
        }
    }
}

export const ratingStore = new RatingStore();
