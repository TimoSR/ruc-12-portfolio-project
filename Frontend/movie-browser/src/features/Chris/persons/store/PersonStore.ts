import { makeAutoObservable, runInAction } from 'mobx'
import type { PersonItem, PagedResult } from '../index'

export interface IPersonStore {
    actors: PersonItem[]
    currentPage: number
    totalPages: number
    pageSize: number
    isLoading: boolean
    error: string | null
    loadPersons(page?: number): Promise<void>
    nextPage(): Promise<void>
    previousPage(): Promise<void>
}

export class PersonStore implements IPersonStore {
    actors: PersonItem[] = []
    currentPage: number = 1
    totalPages: number = 1
    pageSize: number = 20
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async loadPersons(page: number = 1): Promise<void> {
        this.isLoading = true
        this.error = null

        try {
            const result = await this.fetchActors(page, this.pageSize)

            runInAction(() => {
                this.actors = result.items
                this.currentPage = result.page
                this.totalPages = result.totalPages
                this.isLoading = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load actors'
            runInAction(() => {
                this.error = message
                this.actors = []
                this.isLoading = false
            })
        }
    }

    async nextPage(): Promise<void> {
        if (this.currentPage < this.totalPages) {
            await this.loadPersons(this.currentPage + 1)
        }
    }

    async previousPage(): Promise<void> {
        if (this.currentPage > 1) {
            await this.loadPersons(this.currentPage - 1)
        }
    }

    private async fetchActors(page: number, pageSize: number): Promise<PagedResult<PersonItem>> {
        // Mock data - replace with API call later
        await new Promise(resolve => setTimeout(resolve, 300))

        const mockActors: PersonItem[] = Array.from({ length: 100 }, (_, i) => ({
            nconst: `nm${String(i + 1).padStart(7, '0')}`,
            primaryName: `Actor ${i + 1}`,
            birthYear: 1950 + (i % 50),
            deathYear: i % 10 === 0 ? 2020 : undefined,
            primaryProfession: ['actor', 'producer'].slice(0, (i % 2) + 1),
            knownForTitles: [`tt${String(i * 100 + 1).padStart(7, '0')}`],
            averageRating: 5 + (i % 5)
        }))

        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const items = mockActors.slice(startIndex, endIndex)

        return {
            items,
            page,
            pageSize,
            totalPages: Math.ceil(mockActors.length / pageSize),
            totalCount: mockActors.length
        }
    }
}
