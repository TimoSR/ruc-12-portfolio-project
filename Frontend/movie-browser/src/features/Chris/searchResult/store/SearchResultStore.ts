import { makeAutoObservable, runInAction } from 'mobx'

export interface SearchResultItem {
    id: string
    title: string
    type: 'movie' | 'person'
    image?: string
    description?: string
}

export interface ISearchResultStore {
    query: string
    results: SearchResultItem[]
    peopleResults: SearchResultItem[]
    movieResults: SearchResultItem[]
    isLoading: boolean
    setQuery(query: string): void
    search(query: string): Promise<void>
}

export class SearchResultStore implements ISearchResultStore {
    query: string = ''
    results: SearchResultItem[] = []
    isLoading: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    setQuery(query: string) {
        this.query = query
    }

    get peopleResults() {
        return this.results.filter(r => r.type === 'person')
    }

    get movieResults() {
        return this.results.filter(r => r.type === 'movie')
    }

    async search(query: string): Promise<void> {
        this.setQuery(query)
        this.isLoading = true

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            runInAction(() => {
                this.results = [
                    // People
                    { id: 'p1', title: 'Elizabeth Marvel', type: 'person', description: 'Actress • Director • Writer', image: 'https://placehold.co/50x50' },
                    { id: 'p2', title: 'Marilyn Maxwell', type: 'person', description: 'Actress • Soundtrack', image: 'https://placehold.co/50x50' },
                    { id: 'p3', title: 'Arlene Martel', type: 'person', description: 'Actress', image: 'https://placehold.co/50x50' },
                    { id: 'p4', title: 'Marvel', type: 'person', description: 'Writer • Editor • Production Manager', image: 'https://placehold.co/50x50' },
                    { id: 'p5', title: 'Maurice Marvel Meredith', type: 'person', description: 'Actor', image: 'https://placehold.co/50x50' },
                    { id: 'p6', title: 'Marvelous Marvin Hagler', type: 'person', description: 'Actor', image: 'https://placehold.co/50x50' },
                    { id: 'p7', title: 'Captain Marvel', type: 'person', description: 'Character', image: 'https://placehold.co/50x50' },

                    // Movies
                    { id: 'm1', title: 'Captain Marvel', type: 'movie', description: '2019 • Action, Adventure, Sci-Fi', image: 'https://placehold.co/50x75' },
                    { id: 'm2', title: 'The Marvels', type: 'movie', description: '2023 • Action, Adventure, Fantasy', image: 'https://placehold.co/50x75' },
                    { id: 'm3', title: 'Marvel One-Shot: Item 47', type: 'movie', description: '2012 • Short, Action, Sci-Fi', image: 'https://placehold.co/50x75' },
                    { id: 'm4', title: 'Marvel One-Shot: Agent Carter', type: 'movie', description: '2013 • Short, Action, Adventure', image: 'https://placehold.co/50x75' },
                    { id: 'm5', title: 'Marvel One-Shot: All Hail the King', type: 'movie', description: '2014 • Short, Action, Crime', image: 'https://placehold.co/50x75' },
                    { id: 'm6', title: 'Marvel Studios: Assembling a Universe', type: 'movie', description: '2014 • Documentary', image: 'https://placehold.co/50x75' },
                ]
                this.isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                this.isLoading = false
                console.error("Search failed", error)
            })
        }
    }
}
