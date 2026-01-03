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

    // structured query state
    structuredQuery = { title: '', plot: '', character: '', name: '' }
    isAdvancedSearch = false

    constructor() {
        makeAutoObservable(this)
    }

    setAdvancedSearch(visible) {
        console.log('[SearchStore] setAdvancedSearch called with:', visible);
        this.isAdvancedSearch = visible;
    }

    setStructuredQueryField(field, value) {
        this.structuredQuery[field] = value;
    }

    resetStructuredQuery() {
        this.structuredQuery = { title: '', plot: '', character: '', name: '' };
    }

    /**
     * Set the search query text.
     * @param {string} value 
     */
    setQuery(value) {
        console.log('[SearchStore] setQuery called with:', value);
        this.query = value;
        if (!this.isAdvancedSearch) {
            // Sync basic query to structured title if needed, or keep separate. 
            // Keeping separate is safer.
        }
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
        this.structuredQuery = { title: '', plot: '', character: '', name: '' }
        this.results = []
        this.error = null
        this.cancelPendingSearch()
    }

    /**
     * Perform immediate search.
     * Automagically saves to history if found.
     */
    async searchNow() {
        if (this.isAdvancedSearch) {
            await this.searchStructuredNow();
            return;
        }

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
                this.isResultsVisible = true
            })
        }
    }

    async searchStructuredNow() {
        const { title, plot, character, name } = this.structuredQuery;
        // Check if at least one field is filled
        if (!title && !plot && !character && !name) return;

        this.isSearching = true;
        this.error = null;

        try {
            const params = new URLSearchParams();
            if (title) params.append('title', title);
            if (plot) params.append('plot', plot);
            if (character) params.append('character', character);
            if (name) params.append('name', name);
            params.append('page', '1');
            params.append('pageSize', '20'); // Limit for now

            const res = await fetch(`http://localhost:5001/api/v1/titles/structured-search?${params.toString()}`);
            if (!res.ok) throw new Error('Structured search failed');

            const data = await res.json();
            const items = (data.items || []).map(t => ({
                id: t.legacyId || t.id,
                title: t.primaryTitle,
                description: `${t.startYear || 'N/A'} • ${t.titleType}`,
                type: 'movie'
            }));

            runInAction(() => {
                this.results = items;
                this.isSearching = false;
                this.isResultsVisible = true;
            });

        } catch (error) {
            runInAction(() => {
                this.error = error.message;
                this.results = [];
                this.isSearching = false;
                this.isResultsVisible = true;
            });
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

        if (this.isAdvancedSearch) {
            // For advanced, maybe don't debounce, wait for explicit enter/click? 
            // Or debounce. Let's do debounce for now but checking fields.
            const { title, plot, character, name } = this.structuredQuery;
            if (!title && !plot && !character && !name) {
                return;
            }
        } else {
            if (this.query.trim().length === 0) {
                this.clear();
                return;
            }
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
        console.warn('[SearchStore] fetchResults called with query:', query, 'and type:', type);
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
                id: p.id,
                name: p.primaryName || p.name, // Fix: API returns primaryName
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
