import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { PersonItem } from '../index'
import { PersonImage } from './PersonImage'
import { BookmarkButton } from '../../bookmarks/components/BookmarkButton'

export const PersonCard = observer(PersonCardBase)

type PersonCardProps = {
  actor: PersonItem
  onClick: () => void
  className?: string
}

function PersonCardBase({ actor, onClick, className = '' }: PersonCardProps) {
  return (
    <Card className={className} onClick={onClick}>
      <ImagePlaceholder style={{ position: 'relative' }}>
        <PersonImage nconst={actor.nconst} className="w-100 h-100 object-fit-cover" />
        <BookmarkOverlay onClick={(e) => e.stopPropagation()}>
          <BookmarkButton
            targetId={actor.nconst}
            targetType="person"
            displayName={actor.primaryName}
          />
        </BookmarkOverlay>
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
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(55, 65, 81, 0.6);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
  }

  &:hover .bookmark-overlay {
    opacity: 1;
  } 
`

const ImagePlaceholder = styled.div`
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;

    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const BookmarkOverlay = styled.div.attrs({ className: 'bookmark-overlay' })`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`
