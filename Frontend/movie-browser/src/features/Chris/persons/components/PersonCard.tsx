import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { PersonItem } from '../index'

export const PersonCard = observer(PersonCardBase)

type PersonCardProps = {
  actor: PersonItem
  onClick: () => void
  className?: string
}

function PersonCardBase({ actor, onClick, className = '' }: PersonCardProps) {
  return (
    <Card className={className} onClick={onClick}>
      <ImagePlaceholder>
        <PlaceholderIcon>👤</PlaceholderIcon>
      </ImagePlaceholder>
      <Content>
        <Name>{actor.primaryName}</Name>
        {actor.primaryProfession && actor.primaryProfession.length > 0 && (
          <Profession>{actor.primaryProfession.join(', ')}</Profession>
        )}
        <Meta>
          {actor.birthYear && <span>{actor.birthYear}</span>}
          {actor.deathYear && <span> - {actor.deathYear}</span>}
          {actor.averageRating && (
            <Rating>★ {actor.averageRating.toFixed(1)}</Rating>
          )}
        </Meta>
      </Content>
    </Card>
  )
}

// === Styled Components ===

const Card = styled.div`
  background: linear-gradient(145deg, #1e1e2e, #2a2a3e);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    border-color: rgba(139, 92, 246, 0.5);
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #3b3b5c, #2a2a3e);
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlaceholderIcon = styled.span`
  font-size: 4rem;
  opacity: 0.5;
`

const Content = styled.div`
  padding: 1rem;
`

const Name = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Profession = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`

const Rating = styled.span`
  color: #fbbf24;
  margin-left: auto;
`
