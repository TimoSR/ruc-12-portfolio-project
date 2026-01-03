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

    private async fetchActor(id: string): Promise<PersonItem> {
        const API_BASE = 'http://localhost:5001/api/v1';

        // Parallel fetch for details and professions and known-for
        const [personRes, profRes, knownForRes] = await Promise.all([
            fetch(`${API_BASE}/persons/${id}`),
            fetch(`${API_BASE}/persons/${id}/professions`),
            fetch(`${API_BASE}/persons/${id}/known-for`)
        ]);

        if (!personRes.ok) throw new Error('Person not found');

        const person = await personRes.json();

        let professions: string[] = [];
        if (profRes.ok) {
            const profData = await profRes.json();
            professions = profData.map((p: { profession: string }) => p.profession);
        }

        let knownFor: string[] = [];
        if (knownForRes.ok) {
            const knownData = await knownForRes.json();
            // Currently returns IDs only. Ideally we'd map these to titles but the endpoint only gives IDs.
            // We'll show IDs for now to verify data flow, or empty if it users prefer. 
            // Given the user wants NAMES, showing IDs might be confusing. 
            // Let's filter out knownFor for now or map to ID strings.
            // knownData is { titleId: string, primaryTitle: string }[]
            knownFor = knownData.map((k: { primaryTitle: string }) => k.primaryTitle);
        }

        return {
            nconst: person.legacyId || person.id,
            primaryName: person.primaryName,
            birthYear: person.birthYear,
            deathYear: person.deathYear,
            primaryProfession: professions,
            knownForTitles: knownFor,
            averageRating: 0 // Not provided by main endpoint
        };
    }
}
