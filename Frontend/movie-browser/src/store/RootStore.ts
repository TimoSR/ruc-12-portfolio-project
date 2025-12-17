import { createContext, useContext } from 'react'
import { AuthStore } from '../features/Chris/auth/store/AuthStore'
import { BookmarkStore } from '../features/bookmarks/store/BookmarkStore'
import { RatingStore } from '../features/Chris/movies/store/RatingStore'

export class RootStore {
    authStore: AuthStore
    bookmarkStore: BookmarkStore
    ratingStore: RatingStore

    constructor() {
        this.authStore = new AuthStore()
        this.bookmarkStore = new BookmarkStore()
        this.ratingStore = new RatingStore()
    }
}

export const rootStore = new RootStore()
export const RootStoreContext = createContext<RootStore>(rootStore)

export const useRootStore = () => {
    const context = useContext(RootStoreContext)
    if (!context) {
        throw new Error('useRootStore must be used within a RootStoreProvider')
    }
    return context
}
