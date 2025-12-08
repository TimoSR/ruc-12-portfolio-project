import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { ActorStore, type IActorStore } from '../store/ActorStore'
import { ActorCard } from '../components/ActorCard'
import { Pagination } from '../components/Pagination'

export const ActorListView = observer(ActorListViewBase)

type ActorListViewProps = {
    onActorClick?: (nconst: string) => void
    className?: string
}

function ActorListViewBase({ onActorClick, className = '' }: ActorListViewProps) {
    const store = useLocalObservable<IActorStore>(() => new ActorStore())

    useEffect(() => {
        void store.loadActors(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container className={className}>

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
                                onClick={() => onActorClick?.(actor.nconst)}
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
