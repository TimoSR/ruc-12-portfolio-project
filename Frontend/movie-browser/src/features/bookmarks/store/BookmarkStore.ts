import { makeAutoObservable, runInAction } from 'mobx'
import type { Bookmark, BookmarkTargetType } from '../types'

const STORAGE_KEY = 'movie-browser-bookmarks'

export interface IBookmarkStore {
    bookmarks: Bookmark[]
    isLoading: boolean
    error: string | null

    fetchBookmarks(type?: BookmarkTargetType): Promise<void>
    addBookmark(targetId: string, type: BookmarkTargetType, title?: string): Promise<void>
    removeBookmark(targetId: string, type: BookmarkTargetType): Promise<void>
    isBookmarked(targetId: string, type: BookmarkTargetType): boolean
    getBookmarksByType(type: BookmarkTargetType): Bookmark[]
}

export class BookmarkStore implements IBookmarkStore {

    bookmarks: Bookmark[] = []
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.loadFromStorage()
    }

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                this.bookmarks = JSON.parse(stored)
            }
        } catch (error) {
            console.error('Failed to load bookmarks from storage:', error)
        }
    }

    private saveToStorage(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookmarks))
        } catch (error) {
            console.error('Failed to save bookmarks to storage:', error)
        }
    }

    async fetchBookmarks(_type?: BookmarkTargetType): Promise<void> {
        this.isLoading = true
        this.error = null

        try {
            await new Promise(resolve => setTimeout(resolve, 200))

            runInAction(() => {
                this.isLoading = false
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch bookmarks'

            runInAction(() => {
                this.error = message
                this.isLoading = false
            })
        }
    }

    async addBookmark(targetId: string, type: BookmarkTargetType, title?: string): Promise<void> {
        if (this.isBookmarked(targetId, type)) {
            return
        }

        const newBookmark: Bookmark = {
            id: crypto.randomUUID(),
            targetId,
            targetType: type,
            addedAt: new Date().toISOString(),
            note: title ? { title } : undefined
        }

        runInAction(() => {
            this.bookmarks.push(newBookmark)
            this.saveToStorage()
        })
    }

    async removeBookmark(targetId: string, type: BookmarkTargetType): Promise<void> {
        runInAction(() => {
            this.bookmarks = this.bookmarks.filter(
                b => !(b.targetId === targetId && b.targetType === type)
            )
            this.saveToStorage()
        })
    }

    isBookmarked(targetId: string, type: BookmarkTargetType): boolean {
        return this.bookmarks.some(
            b => b.targetId === targetId && b.targetType === type
        )
    }

    getBookmarksByType(type: BookmarkTargetType): Bookmark[] {
        return this.bookmarks.filter(b => b.targetType === type)
    }
}
