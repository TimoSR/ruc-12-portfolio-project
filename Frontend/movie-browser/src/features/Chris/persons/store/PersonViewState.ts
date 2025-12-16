// src/store/ActorViewState.ts
import { makeAutoObservable } from 'mobx'

export class PersonViewState {
    // 1. Client State (Inputs)
    page: number = 1
    pageSize: number = 20
    searchQuery: string = ''

    constructor() {
        makeAutoObservable(this)
    }

    // 2. Actions
    setPage(page: number) {
        this.page = page
    }

    setSearchQuery(query: string) {
        this.searchQuery = query
        this.page = 1 // Reset to page 1 on new search
    }

    nextPage(totalPages: number) {
        if (this.page < totalPages) {
            this.page++
        }
    }

    previousPage() {
        if (this.page > 1) {
            this.page--
        }
    }
}