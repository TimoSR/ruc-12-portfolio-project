import { makeAutoObservable, runInAction } from 'mobx'
import { AuthStore } from '../../../auth/store/AuthStore'

export interface BookmarkItem {
    accountId: string
    titleId?: string
    personId?: string
    notes?: string
    createdAt: string
    // details will be fetched separately
    details?: any
}

export class ProfileStore {
    bookmarks: BookmarkItem[] = []
    isLoading = false
    error: string | null = null
    authStore: AuthStore

    constructor(authStore: AuthStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async loadBookmarks() {
        if (!this.authStore.token || !this.authStore.accountId) return

        this.isLoading = true
        this.error = null

        try {
            const res = await fetch(`/api/v1/accounts/${this.authStore.accountId}/bookmarks`, {
                headers: {
                    'Authorization': `Bearer ${this.authStore.token}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                runInAction(() => {
                    this.bookmarks = data
                })

                // Fetch details for each bookmark
                await this.fetchDetails()
            } else {
                runInAction(() => {
                    this.error = "Failed to load bookmarks"
                })
            }
        } catch (e) {
            runInAction(() => {
                this.error = "Error loading bookmarks"
            })
            console.error(e)
        } finally {
            runInAction(() => {
                this.isLoading = false
            })
        }
    }

    async fetchDetails() {
        // This is a naive implementation. In a real app, we'd want a bulk fetch endpoint.
        // For now, we'll just fetch each item individually.

        const promises = this.bookmarks.map(async (b) => {
            if (b.details) return // already fetched

            try {
                if (b.titleId) {
                    const res = await fetch(`/api/v1/titles/${b.titleId}`, {
                        headers: { 'Authorization': `Bearer ${this.authStore.token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        runInAction(() => {
                            b.details = data
                        })
                    }
                } else if (b.personId) {
                    const res = await fetch(`/api/v1/persons/${b.personId}`, {
                        headers: { 'Authorization': `Bearer ${this.authStore.token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        runInAction(() => {
                            b.details = data
                        })
                    }
                }
            } catch (e) {
                console.error("Failed to fetch details for bookmark", b, e)
            }
        })

        await Promise.all(promises)
    }
}
