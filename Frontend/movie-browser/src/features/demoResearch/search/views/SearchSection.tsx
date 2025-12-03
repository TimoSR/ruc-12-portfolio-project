import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { SearchStore } from '../store/SearchStore'
import { SearchInput } from '../components/SearchInput'
import { SearchResults } from '../components/SearchResults'

export interface SearchSectionProps {
    className?: string
    /**
     * Optional: inject a custom store instance.
     * If not provided, the view creates its own per-component store.
     */
    store?: SearchStore
}

const SearchSectionBase = ({ className = '', store }: SearchSectionProps) => {
    const localStore = useLocalObservable(() => new SearchStore())
    const effectiveStore = store ?? localStore

    return (
        <Section className={className}>
            <Header>
                <Title>
                    Search
                </Title>
                <Subtitle>
                    Type a query and we&apos;ll fetch matching items.
                </Subtitle>
            </Header>

            <SearchInput
                value={effectiveStore.query}
                placeholder="Search something..."
                label="Search"
                onChange={value => {
                    effectiveStore.setQuery(value)
                    effectiveStore.searchDebounced(350)
                }}
                onSearch={() => {
                    void effectiveStore.searchNow()
                }}
                onClear={() => {
                    effectiveStore.clear()
                }}
                autoFocus
                isLoading={effectiveStore.isSearching}
            />

            <SearchResults
                query={effectiveStore.query}
                results={effectiveStore.results}
                isSearching={effectiveStore.isSearching}
                error={effectiveStore.error}
            />
        </Section>
    )
}

export const SearchSection = observer(SearchSectionBase)

/* ===========================
   styled-components
   =========================== */

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
