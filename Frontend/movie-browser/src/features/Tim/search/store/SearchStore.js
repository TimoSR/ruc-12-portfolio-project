// @ts-nocheck
import { makeAutoObservable, runInAction } from 'mobx'

/**
 * @fileoverview Search Store for Movies and Actors.
 * Implements requirement 3-E.5 (Search movies & people) and 1-D.2 (Search history).
 */
export class SearchStore {
    query = ''
    /** @type {'movie'|'person'|'all'} */
    searchType = 'all'
    results = []
    /** @type {Array<{id: number, query: string, timestamp: string}>} */
    history = []
    isSearching = false
    error = null

    // Private
    searchTimeoutId = null

    constructor() {
        makeAutoObservable(this)
    }

    /**
     * Set the search query text.
     * @param {string} value 
     */
    setQuery(value) {
        console.log('[SearchStore] setQuery called with:', value);
        this.query = value;
        console.log('[SearchStore] query is now:', this.query);
    }

    /**
     * Toggle between movie, person, or all search.
     * @param {'movie'|'person'|'all'} type
     */
    setSearchType(type) {
        console.log('[SearchStore] setSearchType called with:', type);
        this.searchType = type;
        console.log('[SearchStore] searchType is now:', this.searchType);
        // Clear results to avoid confusion
        this.results = [];
    }

    clear() {
        console.log('[SearchStore] clear called');
        this.query = ''
        this.results = []
        this.error = null
        this.cancelPendingSearch()
    }

    /**
     * Perform immediate search.
     * Automagically saves to history if found.
     */
    async searchNow() {
        const trimmed = this.query.trim()
        if (trimmed.length === 0) {
            this.clear()
            return
        }

        this.cancelPendingSearch()
        this.isSearching = true
        this.error = null

        try {
            // MOCK API CALL
            const resultItems = await this.fetchResults(trimmed, this.searchType)

            runInAction(() => {
                this.results = resultItems
                this.isSearching = false
            })

            // Requirement 1-D.2: Save search history
            this.saveSearchHistory(trimmed);

        } catch (error) {
            runInAction(() => {
                this.error = error.message || 'Unknown error'
                this.results = []
                this.isSearching = false
            })
        }
    }

    /**
     * Debounced search for typing.
     * @param {number} delayMs 
     */
    searchDebounced(delayMs = 500) {
        this.cancelPendingSearch()
        if (this.query.trim().length === 0) {
            this.clear();
            return;
        }

        this.searchTimeoutId = setTimeout(() => {
            this.searchNow()
        }, delayMs)
    }

    cancelPendingSearch() {
        if (this.searchTimeoutId) {
            clearTimeout(this.searchTimeoutId)
            this.searchTimeoutId = null
        }
    }

    /**
     * Mock Fetch Results
     * @param {string} query 
     * @param {'movie'|'person'|'all'} type
     */
    async fetchResults(query, type) {
        await new Promise(r => setTimeout(r, 600)); // Network delay

        const movies = [
            { id: 'tt0110912', title: `${query} Fiction`, description: '1994 • Crime, Drama', type: 'movie' },
            { id: 'tt0068646', title: `The ${query}father`, description: '1972 • Crime, Drama', type: 'movie' },
        ];

        const people = [
            { id: 'nm0000158', name: `${query} Hanks`, description: 'Actor • Producer', type: 'person' },
            { id: 'nm0000204', name: `Natalie ${query}`, description: 'Actress • Producer', type: 'person' },
        ];

        if (type === 'movie') {
            return movies;
        } else if (type === 'person') {
            return people;
        } else {
            // 'all' - Merge results
            return [...movies, ...people];
        }
    }

    /**
     * Saves query to history (fire and forget).
     * @param {string} query 
     */
    async saveSearchHistory(query) {
        // Requirement 1-D.2
        try {
            await new Promise(r => setTimeout(r, 200)); // Mock network
            runInAction(() => {
                const newEntry = {
                    id: Date.now(),
                    query: query,
                    timestamp: new Date().toISOString()
                };
                this.history.unshift(newEntry);
            });
            console.log(`Saved "${query}" to search history.`);
        } catch (e) {
            console.error('Failed to save history', e);
        }
    }

    /**
     * Fetches search history for the current user.
     * @param {string} userId
     */
    async fetchSearchHistory(userId) {
        if (!userId) return;

        try {
            await new Promise(r => setTimeout(r, 400)); // Mock delay

            // Mock data - normally GET /api/v1/search-history
            runInAction(() => {
                this.history = [
                    { id: 1, query: "Tom Hanks", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
                    { id: 2, query: "Inception", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
                    { id: 3, query: "Comedy 2023", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
                ];
            });
            console.log('[SearchStore] Fetched history for user', userId);
        } catch (e) {
            console.error('Failed to fetch history', e);
        }
    }
}

export const searchStore = new SearchStore();
