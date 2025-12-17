import { makeObservable, observable, action, runInAction } from 'mobx'
import { apiClient } from '../../../api/client'
import type { Bookmark, BookmarkTargetType } from '../types'

export interface IBookmarkStore {
    bookmarks: Bookmark[]
    isLoading: boolean
    error: string | null

    fetchBookmarks(accountId: string): Promise<void>
    addBookmark(accountId: string, targetId: string, type: BookmarkTargetType, title?: string, posterUrl?: string): Promise<void>
    removeBookmark(accountId: string, targetId: string, type: BookmarkTargetType): Promise<void>
    isBookmarked(targetId: string, type: BookmarkTargetType): boolean
    getBookmarksByType(type: BookmarkTargetType): Bookmark[]
}

export class BookmarkStore implements IBookmarkStore {

    bookmarks: Bookmark[] = []
    isLoading: boolean = false
    error: string | null = null

    constructor() {
        makeObservable(this, {
            bookmarks: observable,
            isLoading: observable,
            error: observable,
            fetchBookmarks: action,
            addBookmark: action,
            removeBookmark: action
        })
    }

    async fetchBookmarks(accountId: string): Promise<void> {
        this.isLoading = true
        try {
            const data = await apiClient(`/accounts/${accountId}/bookmarks`) as any[]
            runInAction(() => {
                this.bookmarks = data.map(b => {
                    let title = b.targetId
                    let posterUrl = undefined
                    try {
                        if (b.note) {
                            const noteData = JSON.parse(b.note)
                            title = noteData.title || title
                            posterUrl = noteData.imageUrl
                        }
                    } catch (e) {
                        // Note wasn't JSON, ignore
                    }
                    return {
                        ...b,
                        title,
                        posterUrl
                    }
                })
                this.isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to fetch bookmarks'
                this.isLoading = false
            })
        }
    }

    async addBookmark(accountId: string, targetId: string, type: BookmarkTargetType, title?: string, posterUrl?: string): Promise<void> {
        if (this.isBookmarked(targetId, type)) return

        this.isLoading = true
        try {
            const note = JSON.stringify({ title, imageUrl: posterUrl })
            await apiClient(`/accounts/${accountId}/bookmarks`, {
                method: 'POST',
                body: JSON.stringify({
                    targetId,
                    targetType: type,
                    note
                })
            })
            await this.fetchBookmarks(accountId)
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to add bookmark'
                this.isLoading = false
            })
        }
    }

    async removeBookmark(accountId: string, targetId: string, type: BookmarkTargetType): Promise<void> {
        this.isLoading = true
        try {
            await apiClient(`/accounts/${accountId}/bookmarks/${targetId}`, {
                method: 'DELETE'
            })
            await this.fetchBookmarks(accountId)
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to remove bookmark'
                this.isLoading = false
            })
        }
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
