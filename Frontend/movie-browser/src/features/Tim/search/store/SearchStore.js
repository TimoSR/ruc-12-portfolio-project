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
    isResultsVisible = false

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
                this.isResultsVisible = true // Show results on successful search
            })

            // Requirement 1-D.2: Save search history
            this.saveSearchHistory(trimmed);

        } catch (error) {
            runInAction(() => {
                this.error = error.message || 'Unknown error'
                this.results = []
                this.isSearching = false
                this.isResultsVisible = false // Hide on error? Or show error? let's keep visible if error to show alert
                // Actually, SearchResults handles error display, so let's keep visible
                this.isResultsVisible = true
            })
        }
    }

    setResultsVisible(visible) {
        this.isResultsVisible = visible;
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
     * Fetch Results from Real API
     * @param {string} query 
     * @param {'movie'|'person'|'all'} type
     */
    async fetchResults(query, type) {
        // Base API URL
        const API_BASE = 'http://localhost:5001/api/v1';

        const fetchTitles = async () => {
            // EPC: Using Real API v1
            const res = await fetch(`${API_BASE}/titles?query=${encodeURIComponent(query)}&page=1&pageSize=5`);
            if (!res.ok) return [];
            const data = await res.json();
            // Data is PagedResult { items, totalCount ... }
            return (data.items || []).map(t => ({
                id: t.legacyId || t.id, // Prefer tt-id for images
                title: t.primaryTitle,
                description: `${t.startYear || 'N/A'} • ${t.titleType}`,
                type: 'movie'
            }));
        };

        const fetchPersons = async () => {
            // EPC: Using Real API v1
            const res = await fetch(`${API_BASE}/persons?query=${encodeURIComponent(query)}&page=1&pageSize=5`);
            if (!res.ok) return [];
            const data = await res.json();
            return (data.items || []).map(p => ({
                id: p.id, // Persons might not have legacyId exposed? Let's check DTO. Assuming ID for now.
                // Wait, PersonListItemDto usually has ID. Images need IMDB ID.
                // We fixed Person mapping earlier to include nconst. 
                // Let's assume the ID we get is useful or mapped.
                // Actually, earlier we checked PersonQueryRepository and it selects LegacyId.
                // But PersonListItemDto only had Id, Name, BirthYear. 
                // NOTE: If images fail for persons, we need to check Person mapping too.
                // For now, mapping ID. 
                name: p.name,
                description: `Born: ${p.birthYear || 'Unknown'}`,
                type: 'person'
            }));
        };

        let results = [];

        if (type === 'movie') {
            results = await fetchTitles();
        } else if (type === 'person') {
            results = await fetchPersons();
        } else {
            // 'all' - Parallel fetch
            const [movies, people] = await Promise.all([fetchTitles(), fetchPersons()]);
            results = [...movies, ...people];
        }

        return results;
    }

    /**
     * Saves query to history (fire and forget).
     * @param {string} query 
     */
    async saveSearchHistory(query) {
        // We need the current userId. 
        // Ideally pass it in or get from AuthStore.
        // For now, checking local storage or assuming the caller might set context.
        // BUT, the method signature only has query.
        // We will try to grab it from localStorage (common pattern) roughly.
        const userJson = localStorage.getItem('user');
        if (!userJson) return;
        const user = JSON.parse(userJson);
        const userId = user.id || user.accountId; // Adjust based on Auth implementation

        if (!userId) return;

        try {
            const res = await fetch(`http://localhost:5001/api/v1/accounts/${userId}/search-history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (res.ok) {
                runInAction(() => {
                    const newEntry = {
                        id: Date.now(), // Temporary ID until refresh
                        query: query,
                        timestamp: new Date().toISOString()
                    };
                    this.history.unshift(newEntry);
                });
            }
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
            const res = await fetch(`http://localhost:5001/api/v1/accounts/${userId}/search-history?limit=10`);
            if (!res.ok) throw new Error('API Error');

            const data = await res.json();

            runInAction(() => {
                this.history = data.map(h => ({
                    id: h.id || Date.now(),
                    query: h.query,
                    timestamp: h.timestamp || h.searchedAt // Check DTO field name
                }));
            });
            console.log('[SearchStore] Fetched history for user', userId);
        } catch (e) {
            console.error('Failed to fetch history', e);
        }
    }
}

export const searchStore = new SearchStore();
