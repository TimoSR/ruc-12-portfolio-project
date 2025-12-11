import { observer, useLocalObservable } from 'mobx-react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { SearchResultStore, type ISearchResultStore } from '../store/SearchResultStore'
import { SearchResultList } from '../components/SearchResultList'

interface SearchResultViewProps {
    query: string
    className?: string
}

export const SearchResultView = observer(({ query, className = '' }: SearchResultViewProps) => {
    const store = useLocalObservable<ISearchResultStore>(() => new SearchResultStore())

    useEffect(() => {
        if (query) {
            store.search(query)
        }
    }, [query, store])

    return (
        <Container className={className}>
            <Header>
                <Title>Search Results</Title>
                <Subtitle>Showing results for "{query}"</Subtitle>
            </Header>
            <SearchResultList store={store} />
        </Container>
    )
})

const Container = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem 0;
`

const Header = styled.header`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
`

const Subtitle = styled.p`
    font-size: 1.1rem;
    color: var(--color-text-muted);
    margin: 0;
`
