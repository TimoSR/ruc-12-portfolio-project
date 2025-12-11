import { makeAutoObservable, runInAction } from 'mobx'

type SearchResultItem = {
    id: string
    title: string
    description?: string
    url?: string
}

export interface ISearchStore {
    query: string
    results: SearchResultItem[]
    isSearching: boolean
    error: string | null
    searchHistory: string[]
    setQuery(value: string): void
    clear(): void
    searchNow(): Promise<void>
    searchDebounced(delayMs?: number): void
    addToHistory(query: string): void
    removeFromHistory(query: string): void
    clearHistory(): void
    loadHistory(): void
}

export class SearchStore implements ISearchStore {

    query: string = ''
    results: SearchResultItem[] = []
    isSearching: boolean = false
    error: string | null = null

    private searchTimeoutId: number | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.loadHistory()
    }

    setQuery(value: string): void {
        this.query = value
    }

    clear(): void {
        this.query = ''
        this.results = []
        this.error = null
        this.cancelPendingSearch()
    }

    async searchNow(): Promise<void> {

        const trimmed = this.query.trim()

        if (trimmed.length === 0) {
            this.cancelPendingSearch()
            this.results = []
            this.error = null
            this.isSearching = false
            return
        }

        this.cancelPendingSearch()

        this.isSearching = true
        this.error = null

        try {
            const resultItems = await this.fetchResults(trimmed)

            // After await: use runInAction to be safe with enforceActions:'always'
            runInAction(() => {
                this.results = resultItems
                this.isSearching = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'

            runInAction(() => {
                this.error = message
                this.results = []
                this.isSearching = false
            })

            // Allow UI handlers to see the error if they want to manually handle the promise
            throw error
        }
    }

    searchDebounced(delayMs: number = 300): void {
        this.cancelPendingSearch()

        if (this.query.trim().length === 0) {

            runInAction(() => {
                this.results = []
                this.error = null
            })

            return
        }

        const timeoutId = window.setTimeout(() => {
            void this.searchNow()
        }, delayMs)

        this.searchTimeoutId = timeoutId
    }

    private cancelPendingSearch(): void {
        if (this.searchTimeoutId !== null) {
            window.clearTimeout(this.searchTimeoutId)
            this.searchTimeoutId = null
        }
    }

    private async fetchResults(query: string): Promise<SearchResultItem[]> {
        await new Promise(resolve => {
            window.setTimeout(resolve, 400)
        })

        this.addToHistory(query)

        const items: SearchResultItem[] = [
            {
                id: '1',
                title: `Result for "${query}" #1`,
                description: 'This is an example search result.',
                url: 'https://example.com/1'
            },
            {
                id: '2',
                title: `Result for "${query}" #2`,
                description: 'Another example search result.',
                url: 'https://example.com/2'
            }
        ]

        return items
    }

    /* ===========================
       History Management
       =========================== */

    searchHistory: string[] = []

    addToHistory(query: string): void {
        const trimmed = query.trim()
        if (!trimmed) return

        // Remove if already exists to move it to top
        const existingIndex = this.searchHistory.indexOf(trimmed)
        if (existingIndex !== -1) {
            this.searchHistory.splice(existingIndex, 1)
        }

        // Add to front
        this.searchHistory.unshift(trimmed)

        // Limit to 10
        if (this.searchHistory.length > 10) {
            this.searchHistory.pop()
        }

        this.saveHistory()
    }

    removeFromHistory(query: string): void {
        this.searchHistory = this.searchHistory.filter(q => q !== query)
        this.saveHistory()
    }

    clearHistory(): void {
        this.searchHistory = []
        this.saveHistory()
    }

    private saveHistory(): void {
        try {
            localStorage.setItem('search_history', JSON.stringify(this.searchHistory))
        } catch (e) {
            console.warn('Failed to save search history', e)
        }
    }

    loadHistory(): void {
        try {
            const json = localStorage.getItem('search_history')
            if (json) {
                const parsed = JSON.parse(json)
                if (Array.isArray(parsed)) {
                    this.searchHistory = parsed
                }
            }
        } catch (e) {
            console.warn('Failed to load search history', e)
        }
    }
}