import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router' // 1. Import router hooks
import styled from 'styled-components'
import { PersonCard } from '../components/PersonCard'
import { Pagination } from '../components/Pagination'
import { personListQueryOptions } from '../../../../api/queries/personQueries'
import { personListRoute } from '../../../../routes/persons'

type PersonListViewProps = {
    onActorClick?: (personId: string) => void
    className?: string
}

export function PersonListView({ onActorClick, className = '' }: PersonListViewProps) {
    const queryClient = useQueryClient()
    const navigate = useNavigate({ from: personListRoute.fullPath }) // 3. Set context for navigation

    // 4. Source of Truth: The URL (via Router)
    // Instead of useState, we "subscribe" to the URL parameters.
    const { page, query, pageSize } = personListRoute.useSearch()

    // 5. Main Query
    // Just pass the URL params directly to your options
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        isPlaceholderData 
    } = useQuery({
        ...personListQueryOptions({ query, page, pageSize }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    if (data !== undefined) {
      // Pretty-print JSON in the console
      console.log('persons response:', JSON.stringify(data, null, 2));
    }

    const actors = data?.items ?? []
    const totalItems = data?.totalItems ?? 0
    const totalPages = Math.ceil(totalItems / pageSize)

    // 6. Automatic Prefetching (Now powered by URL state)
    // This effect runs whenever the URL changes
    if (!isPlaceholderData && page < totalPages) {
        queryClient.prefetchQuery({
            ...personListQueryOptions({ 
                query, 
                page: page + 1, 
                pageSize 
            }),
            staleTime: 1000 * 60 * 5, // 5 minutes
        })
    }

    // 7. Handlers update the URL, not local state
    const handleNext = () => {
        if (!isPlaceholderData && page < totalPages) {
            navigate({
                search: (old) => ({ ...old, page: old.page + 1 }),
            })
        }
    }

    const handlePrevious = () => {
        navigate({
            search: (old) => ({ ...old, page: Math.max(old.page - 1, 1) }),
        })
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
                                key={actor.id}
                                actor={actor}
                                onClick={() => onActorClick?.(actor.id)}
                            />
                        ))}
                    </ActorGrid>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages || 1}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isLoading={isPlaceholderData}
                    />
                </>
            )}
        </Container>
    )
}

/* ===========================
   styled-components (Unchanged)
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