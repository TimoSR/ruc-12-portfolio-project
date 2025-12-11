import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { ISearchResultStore } from '../store/SearchResultStore'
import { SearchResultSection } from './SearchResultSection'

interface SearchResultListProps {
    store: ISearchResultStore
    className?: string
}

export const SearchResultList = observer(({ store, className = '' }: SearchResultListProps) => {
    if (store.isLoading) {
        return <LoadingMessage>Searching...</LoadingMessage>
    }

    if (store.results.length === 0 && store.query) {
        return <EmptyMessage>No results found for "{store.query}"</EmptyMessage>
    }

    return (
        <ListWrapper className={className}>
            <SearchResultSection title="People" items={store.peopleResults} />
            <SearchResultSection title="Titles" items={store.movieResults} />
        </ListWrapper>
    )
})

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`

const LoadingMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: var(--color-text-muted);
    font-size: 1.1rem;
`

const EmptyMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: var(--color-text-muted);
`
