import { useState, useEffect } from 'react'
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import styled from 'styled-components'
import { PersonCard } from '../components/PersonCard'
import { Pagination } from '../components/Pagination'
import { personListQueryOptions } from '../../../../api/queries/personQueries'

type PersonListViewProps = {
    onActorClick?: (nconst: string) => void
    className?: string
}

export function PersonListView({ onActorClick, className = '' }: PersonListViewProps) {
    const queryClient = useQueryClient()
    
    // 1. State
    const [page, setPage] = useState(1)
    const [searchQuery] = useState('')
    const pageSize = 20

    // 2. Main Query (Current Page)
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        isPlaceholderData 
    } = useQuery({
        ...personListQueryOptions({ query: searchQuery, page, pageSize }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    })

    const actors = data?.items ?? []
    const totalItems = data?.totalItems ?? 0
    const totalPages = Math.ceil(totalItems / pageSize)

    // 3. Automatic Prefetching (Next Page)
    useEffect(() => {
        // Only prefetch if not currently loading and there is a next page
        if (!isPlaceholderData && page < totalPages) {
            const nextPage = page + 1
            
            queryClient.prefetchQuery({
                ...personListQueryOptions({ 
                    query: searchQuery, 
                    page: nextPage, 
                    pageSize 
                }),
                // ✅ CRITICAL: This checks the cache first!
                // If Page 2 is already in memory (and < 5 mins old), 
                // this line effectively cancels the network request.
                staleTime: 1000 * 60 * 5, 
            })
        }
    }, [page, searchQuery, pageSize, totalPages, queryClient, isPlaceholderData])

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
            {isError && (
                <ErrorMessage>
                    Error: {error instanceof Error ? error.message : 'Unknown error'}
                </ErrorMessage>
            )}

            {isLoading && <LoadingMessage>Loading actors...</LoadingMessage>}

            {!isLoading && !isError && actors.length === 0 && (
                <EmptyMessage>No actors found</EmptyMessage>
            )}

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
                        isLoading={isPlaceholderData}
                        // Note: We removed 'onNextHover' because prefetching is now automatic
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
`

const ErrorMessage = styled.div`
    background: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
`

const LoadingMessage = styled.div`
    text-align: center;
    color: #9ca3af;
    padding: 3rem;
`

const EmptyMessage = styled.div`
    text-align: center;
    color: #9ca3af;
    padding: 3rem;
`