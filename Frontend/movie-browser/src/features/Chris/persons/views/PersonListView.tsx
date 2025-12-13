// src/features/Chris/persons/views/PersonListView.tsx
import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import styled from 'styled-components'
import { PersonCard } from '../components/PersonCard'
import { Pagination } from '../components/Pagination'
import { personListQueryOptions } from '../../../../api/queries/personQueries'

type PersonListViewProps = {
    onActorClick?: (nconst: string) => void
    className?: string
}

export function PersonListView({ onActorClick, className = '' }: PersonListViewProps) {
    // 1. Manage View State (Pagination)
    const [page, setPage] = useState(1)
    const pageSize = 20
    const searchQuery = '' // You can lift this to props if you add a search bar later

    // 2. TanStack Query Hook
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        isPlaceholderData 
    } = useQuery({
        ...personListQueryOptions({ query: searchQuery, page, pageSize }),
        // "keepPreviousData" is awesome for pagination - it keeps the old list 
        // on screen while the new page loads, preventing layout shift.
        placeholderData: keepPreviousData, 
    })

    // 3. Derived State
    // Adjust these accessors based on your actual API return shape (e.g., data.items vs data)
    const actors = data?.items || [] 
    const totalItems = data?.totalItems || 0 
    const totalPages = Math.ceil(totalItems / pageSize)

    // 4. Handlers
    const handleNext = () => {
        if (!isPlaceholderData && page < totalPages) {
            setPage(old => old + 1)
        }
    }

    const handlePrevious = () => {
        setPage(old => Math.max(old - 1, 1))
    }

    return (
        <Container className={className}>
            {/* Error State */}
            {isError && (
                <ErrorMessage>
                    Error: {error instanceof Error ? error.message : 'Unknown error'}
                </ErrorMessage>
            )}

            {/* Loading State (Initial load only) */}
            {isLoading && <LoadingMessage>Loading actors...</LoadingMessage>}

            {/* Empty State */}
            {!isLoading && !isError && actors.length === 0 && (
                <EmptyMessage>No actors found</EmptyMessage>
            )}

            {/* Success State */}
            {!isLoading && !isError && actors.length > 0 && (
                <>
                    <ActorGrid>
                        {actors.map((actor: any) => (
                            <PersonCard
                                key={actor.nconst}
                                actor={actor}
                                onClick={() => onActorClick?.(actor.nconst)}
                            />
                        ))}
                    </ActorGrid>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages || 1}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isLoading={isPlaceholderData} // Shows loading spinner on pagination buttons
                    />
                </>
            )}
        </Container>
    )
}

/* ===========================
   styled-components
   =========================== */

const Container = styled.section`
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem 1.5rem 4rem;
`

const ActorGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 640px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
`

const ErrorMessage = styled.div`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
`

const LoadingMessage = styled.div`
    text-align: center;
    color: #9ca3af;
    padding: 3rem;
    font-size: 1.125rem;
`

const EmptyMessage = styled.div`
    text-align: center;
    color: #9ca3af;
    padding: 3rem;
    font-size: 1.125rem;
`