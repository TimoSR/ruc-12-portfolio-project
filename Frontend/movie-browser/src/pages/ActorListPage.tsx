import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { useNavigate } from '@tanstack/react-router'
import styled from 'styled-components'
import { ActorStore, type IActorStore } from '../features/actors/store/ActorStore'
import { ActorCard } from '../features/actors/components/ActorCard'
import { Pagination } from '../features/actors/components/Pagination'

export const ActorListPage = observer(ActorListPageBase)

function ActorListPageBase() {
  const navigate = useNavigate()
  const store = useLocalObservable<IActorStore>(() => new ActorStore())

  useEffect(() => {
    void store.loadActors(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleActorClick = (nconst: string) => {
    navigate({ to: '/actors/$actorId', params: { actorId: nconst } })
  }

  return (
    <Page>
      <Header>
        <Title>Actors</Title>
        <Subtitle>Browse actors and personalities</Subtitle>
      </Header>

      {store.error && <ErrorMessage>{store.error}</ErrorMessage>}

      {store.isLoading && <LoadingMessage>Loading actors...</LoadingMessage>}

      {!store.isLoading && store.actors.length === 0 && (
        <EmptyMessage>No actors found</EmptyMessage>
      )}

      {!store.isLoading && store.actors.length > 0 && (
        <>
          <ActorGrid>
            {store.actors.map(actor => (
              <ActorCard
                key={actor.nconst}
                actor={actor}
                onClick={() => handleActorClick(actor.nconst)}
              />
            ))}
          </ActorGrid>

          <Pagination
            currentPage={store.currentPage}
            totalPages={store.totalPages}
            onPrevious={() => void store.previousPage()}
            onNext={() => void store.nextPage()}
            isLoading={store.isLoading}
          />
        </>
      )}
    </Page>
  )
}

const Page = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`

const Header = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
`

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #9ca3af;
  margin: 0;
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
