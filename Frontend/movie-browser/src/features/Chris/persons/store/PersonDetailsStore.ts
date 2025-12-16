import { makeAutoObservable, runInAction } from 'mobx'
import type { PersonItem } from '../index'

export interface IPersonDetailsStore {
    actor: PersonItem | null
    isLoading: boolean
    error: string | null
    loadActor(nconst: string): Promise<void>
}

export class PersonDetailsStore implements IPersonDetailsStore {
    actor: PersonItem | null = null
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async loadActor(nconst: string): Promise<void> {
        this.isLoading = true
        this.error = null

        try {
            const actor = await this.fetchActor(nconst)

            runInAction(() => {
                this.actor = actor
                this.isLoading = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load actor'
            runInAction(() => {
                this.error = message
                this.actor = null
                this.isLoading = false
            })
        }
    }

    private async fetchActor(nconst: string): Promise<PersonItem> {
        // Mock data - replace with API call later
        await new Promise(resolve => setTimeout(resolve, 300))

        const index = parseInt(nconst.replace('nm', '')) || 1

        return {
            nconst,
            primaryName: `Actor ${index}`,
            birthYear: 1950 + (index % 50),
            deathYear: index % 10 === 0 ? 2020 : undefined,
            primaryProfession: ['actor', 'director', 'producer'].slice(0, (index % 3) + 1),
            knownForTitles: [
                `tt${String(index * 100 + 1).padStart(7, '0')}`,
                `tt${String(index * 100 + 2).padStart(7, '0')}`,
                `tt${String(index * 100 + 3).padStart(7, '0')}`
            ],
            averageRating: 5 + (index % 5)
        }
    }
}
