// @ts-nocheck
import { makeAutoObservable, runInAction } from 'mobx'

/**
 * @fileoverview Search Store for Movies and Actors.
 * Implements requirement 3-E.5 (Search movies & people) and 1-D.2 (Search history).
 */
export class SearchStore {
    query = ''
    /** @type {'movie'|'person'} */
    searchType = 'movie'
    results = []
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
        this.query = value
    }

    /**
     * Toggle between movie and person search.
     * @param {'movie'|'person'} type
     */
    setSearchType(type) {
        this.searchType = type;
        // Optional: Auto-trigger search when type changes? 
        // For now, let's clear results to avoid confusion
        this.results = [];
    }

    clear() {
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
     * @param {'movie'|'person'} type
     */
    async fetchResults(query, type) {
        await new Promise(r => setTimeout(r, 600)); // Network delay

        // Mock data based on type
        if (type === 'movie') {
            return [
                { id: 'tt0110912', title: `Movie: ${query} Fiction`, description: '1994 • Crime, Drama', type: 'movie' },
                { id: 'tt0068646', title: `Movie: The ${query}father`, description: '1972 • Crime, Drama', type: 'movie' },
            ];
        } else {
            return [
                { id: 'nm0000158', name: `Actor: ${query} Hanks`, description: 'Actor • Producer', type: 'person' },
                { id: 'nm0000204', name: `Actor: Natalie ${query}`, description: 'Actress • Producer', type: 'person' },
            ];
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
            console.log(`Saved "${query}" to search history.`);
        } catch (e) {
            console.error('Failed to save history', e);
        }
    }
}

export const searchStore = new SearchStore();
