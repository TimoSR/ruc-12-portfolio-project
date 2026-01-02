import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate({ from: personListRoute.fullPath })

  const search = personListRoute.useSearch()
  const page = search.page ?? 1
  const query = search.query ?? ''
  const pageSize = search.pageSize ?? 24

  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    ...personListQueryOptions({ query, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })

  if (data !== undefined) {
    console.log('persons response:', JSON.stringify(data, null, 2))
  }

  const actors = data?.items ?? []
  const totalItems = data?.totalItems ?? 0
  const totalPages = Math.ceil(totalItems / pageSize)

  if (!isPlaceholderData && page < totalPages) {
    queryClient.prefetchQuery({
      ...personListQueryOptions({
        query,
        page: page + 1,
        pageSize,
      }),
      staleTime: 1000 * 60 * 5,
    })
  }

  const handleNext = () => {
    if (!isPlaceholderData && page < totalPages) {
      navigate({
        search: (old) => ({ ...old, page: (old.page ?? 1) + 1 }),
      })
    }
  }

  const handlePrevious = () => {
    navigate({
      search: (old) => ({ ...old, page: Math.max((old.page ?? 1) - 1, 1) }),
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
   styled-components
   =========================== */

const Container = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
`

/** ✅ 6 per row (with sane fallbacks) */
const ActorGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;

  grid-template-columns: repeat(6, minmax(0, 1fr));

  @media (max-width: 1400px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
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
