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
            const response = await fetch(`http://localhost:5001/api/v1/accounts/${userId}/bookmarks`); // TODO: Use config/env for base URL
            // Fallback for CORS or port issues during dev
            // const response = await fetch(`/api/v1/accounts/${userId}/bookmarks`); 

            if (!response.ok) throw new Error('Failed to fetch bookmarks');

            const data = await response.json();

            // Map Valid DTOs to store format
            this.bookmarks = data.map(b => ({
                id: b.targetId,
                type: b.targetType,
                // Title/Name might not be in the lightweight bookmark DTO, 
                // so we might need to fetch details or just rely on the UI to fetch them.
                // For the list view, we might need a separate mechanism or store enriched data.
                // For now, let's just store what we have.
            }));

            console.log('Fetched bookmarks:', this.bookmarks.length);
        } catch (err) {
            console.error('Failed to fetch bookmarks', err);
            this.error = 'Could not load bookmarks';
        } finally {
            this.isLoading = false;
        }
    }

    async toggleBookmark(userId, targetId, targetType, displayName = '') {
        if (!userId) return;

        const existingIndex = this.bookmarks.findIndex(
            b => b.id === targetId && b.type === targetType
        );
        const isAdding = existingIndex === -1;

        // 1. Optimistic Update
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
            const baseUrl = `http://localhost:5001/api/v1/accounts/${userId}/bookmarks`;
            let response;

            if (isAdding) {
                response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        targetId,
                        targetType,
                        note: ''
                    })
                });
            } else {
                response = await fetch(`${baseUrl}/${targetId}?targetType=${targetType}`, {
                    method: 'DELETE'
                });
            }

            if (!response.ok) throw new Error('API Error');

        } catch (err) {
            console.error('Bookmark toggle failed:', err);
            // Revert on failure
            if (isAdding) {
                this.bookmarks = this.bookmarks.filter(b => b.id !== targetId);
            } else {
                // Ideally refrain from adding back to avoid complexity or re-fetch
                // this.fetchUserBookmarks(userId);
            }
            this.bookmarks = this.bookmarks.filter(b => b.id !== targetId); // Simple revert validation
            this.error = 'Failed to update bookmark';
            // Trigger re-fetch to ensure sync
            this.fetchUserBookmarks(userId);
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
