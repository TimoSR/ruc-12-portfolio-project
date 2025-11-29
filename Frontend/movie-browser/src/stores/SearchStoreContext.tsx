import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { SearchStore } from './SearchStore'

interface SearchStoreProviderProps {
    store: SearchStore
    children: ReactNode
}

const SearchStoreContext = createContext<SearchStore | null>(null)

export const SearchStoreProvider = ({ store, children }: SearchStoreProviderProps) => {
    return (
        <SearchStoreContext.Provider value={store}>
            {children}
        </SearchStoreContext.Provider>
    )
}

export const useSearchStore = (): SearchStore => {
    const store = useContext(SearchStoreContext)

    if (store === null) {
        throw new Error('useSearchStore must be used within a SearchStoreProvider')
    }

    return store
}
