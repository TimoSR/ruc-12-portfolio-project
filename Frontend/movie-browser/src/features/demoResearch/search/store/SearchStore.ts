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
    setQuery(value: string): void
    clear(): void
    searchNow(): Promise<void>
    searchDebounced(delayMs?: number): void
}

export class SearchStore implements ISearchStore {
    query: string = ''
    results: SearchResultItem[] = []
    isSearching: boolean = false
    error: string | null = null

    private searchTimeoutId: number | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
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
            runInAction(() => {
                this.results = []
                this.error = null
            })
            return
        }

        this.cancelPendingSearch()

        runInAction(() => {
            this.isSearching = true
            this.error = null
        })

        try {
            const resultItems = await this.fetchResults(trimmed)

            runInAction(() => {
                this.results = resultItems
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'

            runInAction(() => {
                this.error = message
            })
        } finally {
            runInAction(() => {
                this.isSearching = false
            })
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
}