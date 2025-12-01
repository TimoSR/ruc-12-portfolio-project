import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { ISearchStore } from '../store/SearchStore'

type Props = {
    searchStore: ISearchStore
}

function SearchResultsBase ({ searchStore }: Props) {

    const trimmedQuery = searchStore.query.trim()
    

    if (searchStore.error !== null) {
        return (
            <ErrorMessage>
                {searchStore.error}
            </ErrorMessage>
        )
    }

    if (searchStore.isSearching) {
        return (
            <InfoMessage>
                Searching for <strong>{trimmedQuery || '...'}</strong>
            </InfoMessage>
        )
    }

    if (trimmedQuery.length === 0) {
        return null
    }

    if (searchStore.results.length === 0) {
        return (
            <InfoMessage>
                No results for <strong>{trimmedQuery}</strong>
            </InfoMessage>
        )
    }

    return (
        <ResultsList>
            {searchStore.results.map(item => {

                const hasDescription = (item.description?.length ?? 0) > 0
                const hasUrl = item.url !== undefined

                return (
                    <ResultItem key={item.id}>
                        
                        <ResultTitle> {item.title} </ResultTitle>

                        {hasDescription ? (
                            <ResultDescription> {item.description} </ResultDescription>
                        ): null }

                        {hasUrl ? (
                            <ResultLink href={item.url} target="_blank" rel="noreferrer">
                                Open
                            </ResultLink>
                        ) : null}

                    </ResultItem>
                )
            })}
        </ResultsList>
    )
}

export const SearchResults = observer(SearchResultsBase)

/* ===========================
   styled-components
   =========================== */

const ResultsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
`

const ResultItem = styled.div`
    padding: 0.9rem 1.1rem;
    border-radius: 1rem;
    background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.98));
    border: 1px solid rgba(55, 65, 81, 0.7);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.8);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
`

const ResultTitle = styled.div`
    font-size: 0.95rem;
    font-weight: 600;
    color: #e5e7eb;
`

const ResultDescription = styled.div`
    font-size: 0.875rem;
    color: #9ca3af;
`

const ResultLink = styled.a`
    margin-top: 0.25rem;
    font-size: 0.8rem;
    align-self: flex-start;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    background: linear-gradient(
            to right,
            rgba(168, 85, 247, 0.95),
            rgba(236, 72, 153, 0.95)
    );
    color: white;
    text-decoration: none;
    box-shadow:
            0 6px 15px rgba(168, 85, 247, 0.4),
            0 0 0 1px rgba(15, 23, 42, 0.9);
    transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            filter 0.12s ease;

    &:hover {
        filter: brightness(1.05);
        transform: translateY(-0.5px);
        box-shadow:
                0 10px 20px rgba(168, 85, 247, 0.55),
                0 0 0 1px rgba(15, 23, 42, 0.9);
    }

    &:active {
        transform: translateY(0);
        box-shadow:
                0 4px 10px rgba(88, 28, 135, 0.6),
                0 0 0 1px rgba(15, 23, 42, 0.9);
    }
`

const InfoMessage = styled.div`
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #9ca3af;

    strong {
        color: #e5e7eb;
        font-weight: 500;
    }
`

const ErrorMessage = styled.div`
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.4);
    color: #fecaca;
    font-size: 0.875rem;
`
