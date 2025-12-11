import { useSearch } from '@tanstack/react-router'
import styled from 'styled-components'
import { SearchResultView } from '../features/Chris/searchResult'

export const SearchResultPage = () => {
    const search = useSearch({ strict: false }) as { q?: string }
    const query = search.q || ''

    return (
        <PageContainer>
            <SearchResultView query={query} />
        </PageContainer>
    )
}

const PageContainer = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
`
