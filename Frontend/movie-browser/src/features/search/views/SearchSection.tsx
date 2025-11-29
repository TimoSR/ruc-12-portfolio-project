import { observer } from 'mobx-react'
import styled from 'styled-components'
import { searchStore } from '../store/SearchStore'
import { SearchInput } from '../components/SearchInput'
import { SearchResults } from '../components/SearchResults'

export const SearchSection = observer(() => {
    const store = searchStore

    return (
        <Section>
            <Header>
                <Title>
                    Search
                </Title>
                <Subtitle>
                    Type a query and we&apos;ll fetch matching items.
                </Subtitle>
            </Header>

            <SearchInput
                value={store.query}
                placeholder="Search something..."
                label="Search"
                onChange={value => {
                    store.setQuery(value)
                    store.searchDebounced(350)
                }}
                onSearch={() => {
                    void store.searchNow()
                }}
                onClear={() => {
                    store.clear()
                }}
                autoFocus
                isLoading={store.isSearching}
            />

            <SearchResults
                query={store.query}
                results={store.results}
                isSearching={store.isSearching}
                error={store.error}
            />
        </Section>
    )
})

const Section = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 2rem;
    border-radius: 1.5rem;
    background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 1));
    border: 1px solid rgba(55, 65, 81, 0.8);
    box-shadow:
        0 30px 60px rgba(15, 23, 42, 0.9),
        0 0 0 1px rgba(15, 23, 42, 1);
`

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
`

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: #f9fafb;
`

const Subtitle = styled.p`
    font-size: 0.9rem;
    color: #9ca3af;
`
