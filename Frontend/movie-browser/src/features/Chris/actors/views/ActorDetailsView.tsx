import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { ActorDetailsStore, type IActorDetailsStore } from '../store/ActorDetailsStore'

export const ActorDetailsView = observer(ActorDetailsViewBase)

type ActorDetailsViewProps = {
    actorId: string
    onBack?: () => void
    className?: string
}

function ActorDetailsViewBase({ actorId, onBack, className = '' }: ActorDetailsViewProps) {
    const store = useLocalObservable<IActorDetailsStore>(() => new ActorDetailsStore())

    useEffect(() => {
        void store.loadActor(actorId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actorId])

    if (store.isLoading) {
        return (
            <Container className={className}>
                <LoadingMessage>Loading actor details...</LoadingMessage>
            </Container>
        )
    }

    if (store.error) {
        return (
            <Container className={className}>
                <ErrorMessage>{store.error}</ErrorMessage>
                {onBack && <BackButton onClick={onBack}>← Back to Actors</BackButton>}
            </Container>
        )
    }

    if (!store.actor) {
        return (
            <Container className={className}>
                <EmptyMessage>Actor not found</EmptyMessage>
                {onBack && <BackButton onClick={onBack}>← Back to Actors</BackButton>}
            </Container>
        )
    }

    const { actor } = store

    return (
        <Container className={className}>
            {onBack && <BackButton onClick={onBack}>← Back to Actors</BackButton>}

            <Content>
                <ImageSection>
                    <ImagePlaceholder>
                        <PlaceholderIcon>👤</PlaceholderIcon>
                    </ImagePlaceholder>
                </ImageSection>

                <InfoSection>
                    <Name>{actor.primaryName}</Name>

                    <MetaRow>
                        {actor.birthYear && (
                            <Badge>
                                Born: {actor.birthYear}
                                {actor.deathYear && ` - Died: ${actor.deathYear}`}
                            </Badge>
                        )}
                        {actor.averageRating && (
                            <RatingBadge>★ {actor.averageRating.toFixed(1)}</RatingBadge>
                        )}
                    </MetaRow>

                    {actor.primaryProfession && actor.primaryProfession.length > 0 && (
                        <Section>
                            <SectionTitle>Profession</SectionTitle>
                            <ProfessionList>
                                {actor.primaryProfession.map((profession, index) => (
                                    <ProfessionBadge key={index}>{profession}</ProfessionBadge>
                                ))}
                            </ProfessionList>
                        </Section>
                    )}

                    {actor.knownForTitles && actor.knownForTitles.length > 0 && (
                        <Section>
                            <SectionTitle>Known For</SectionTitle>
                            <TitleList>
                                {actor.knownForTitles.map((title, index) => (
                                    <TitleItem key={index}>{title}</TitleItem>
                                ))}
                            </TitleList>
                        </Section>
                    )}

                    <Section>
                        <SectionTitle>ID</SectionTitle>
                        <IdText>{actor.nconst}</IdText>
                    </Section>
                </InfoSection>
            </Content>
        </Container>
    )
}

/* ===========================
   styled-components
   =========================== */

const Container = styled.section`
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
`

const BackButton = styled.button`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #9ca3af;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    margin-bottom: 2rem;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #f9fafb;
    }
`

const Content = styled.div`
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 3rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
`

const ImageSection = styled.div`
    @media (max-width: 768px) {
        display: flex;
        justify-content: center;
    }
`

const ImagePlaceholder = styled.div`
    width: 100%;
    max-width: 300px;
    aspect-ratio: 2/3;
    background: linear-gradient(135deg, #3b3b5c, #2a2a3e);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const PlaceholderIcon = styled.span`
    font-size: 6rem;
    opacity: 0.5;
`

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`

const Name = styled.h1`
    font-size: 2.5rem;
    font-weight: 800;
    color: #f9fafb;
    margin: 0;
`

const MetaRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`

const Badge = styled.span`
    background: rgba(139, 92, 246, 0.2);
    color: #c4b5fd;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
`

const RatingBadge = styled.span`
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
`

const Section = styled.div``

const SectionTitle = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: #9ca3af;
    margin: 0 0 0.75rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`

const ProfessionList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`

const ProfessionBadge = styled.span`
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    text-transform: capitalize;
`

const TitleList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const TitleItem = styled.div`
    color: #d1d5db;
    font-size: 0.875rem;
    font-family: monospace;
`

const IdText = styled.p`
    color: #6b7280;
    font-family: monospace;
    font-size: 0.875rem;
    margin: 0;
`

const LoadingMessage = styled.div`
    text-align: center;
    color: #9ca3af;
    padding: 3rem;
    font-size: 1.125rem;
`

const ErrorMessage = styled.div`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
`

const EmptyMessage = styled.div`
    text-align: center;
    color: #9ca3af;
    padding: 3rem;
    font-size: 1.125rem;
`
