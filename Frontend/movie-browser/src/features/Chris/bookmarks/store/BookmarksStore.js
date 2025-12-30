// @ts-nocheck
import { makeAutoObservable } from 'mobx';

/**
 * @fileoverview MobX store for managing user bookmarks.
 * Implements requirement 3-E.4 using a mocked backend.
 */
export class BookmarksStore {
    /** @type {Array<{id: string, type: 'movie'|'person', title?: string, name?: string}>} */
    bookmarks = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Fetches bookmarks for the current user.
     * @param {string} userId - User ID to fetch for
     */
    async fetchUserBookmarks(userId) {
        if (!userId) return;

        this.isLoading = true;
        this.error = null;

        try {
            // MOCK DELAY
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock data - normally this comes from GET /api/v1/bookmarks
            // Simulating empty list efficiently, or could return sample data
            // this.bookmarks = []; 

            console.log('Fetched bookmarks for user', userId);
        } catch (err) {
            console.error('Failed to fetch bookmarks', err);
            this.error = 'Could not load bookmarks';
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Toggles bookmark status for an item.
     * @param {string} userId
     * @param {string} targetId
     * @param {'movie'|'person'} targetType
     * @param {string} [displayName] - Optional name/title for local update
     */
    async toggleBookmark(userId, targetId, targetType, displayName = '') {
        if (!userId) return;

        const existingIndex = this.bookmarks.findIndex(
            b => b.id === targetId && b.type === targetType
        );

        const isAdding = existingIndex === -1;

        // Optimistic UI update
        if (isAdding) {
            this.bookmarks.push({
                id: targetId,
                type: targetType,
                title: targetType === 'movie' ? displayName : undefined,
                name: targetType === 'person' ? displayName : undefined
            });
        } else {
            this.bookmarks.splice(existingIndex, 1);
        }

        try {
            // MOCK DELAY
            await new Promise(resolve => setTimeout(resolve, 300));
            // Mock API Call: POST /api/v1/bookmarks/toggle
            console.log(`${isAdding ? 'Added' : 'Removed'} bookmark: ${targetId}`);
        } catch (err) {
            // Revert on failure
            if (isAdding) {
                this.bookmarks = this.bookmarks.filter(b => b.id !== targetId);
            } else {
                // Re-add logic would be here, simplified for mock
            }
            this.error = 'Failed to update bookmark';
        }
    }

    /**
     * Checks if an item is bookmarked.
     * @param {string} targetId
     * @param {'movie'|'person'} targetType
     * @returns {boolean}
     */
    isBookmarked(targetId, targetType) {
        return this.bookmarks.some(b => b.id === targetId && b.type === targetType);
    }
}

export const bookmarksStore = new BookmarksStore();
