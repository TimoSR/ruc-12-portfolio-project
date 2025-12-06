import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { Link } from '@tanstack/react-router'
import { type IBookmarkStore, BookmarkStore } from '../store/BookmarkStore'
import type { BookmarkTargetType } from '../types'
import { useEffect, useState } from 'react'

export const BookmarksSection = observer(BookmarksSectionBase)

type BookmarksSectionProps = {
    className?: string
}

function BookmarksSectionBase({ className = '' }: BookmarksSectionProps) {
    const store = useLocalObservable<IBookmarkStore>(() => new BookmarkStore())
    const [filter, setFilter] = useState<BookmarkTargetType | 'all'>('all')

    useEffect(() => {
        void store.fetchBookmarks()
    }, [store])

    const filteredBookmarks = filter === 'all'
        ? store.bookmarks
        : store.getBookmarksByType(filter)

    const handleRemove = (targetId: string, targetType: BookmarkTargetType) => {
        void store.removeBookmark(targetId, targetType)
    }

    return (
        <Container className={className}>
            <Header>
                <Title>My Bookmarks</Title>
                <FilterTabs>
                    <FilterTab
                        $active={filter === 'all'}
                        onClick={() => setFilter('all')}
                    >
                        All ({store.bookmarks.length})
                    </FilterTab>
                    <FilterTab
                        $active={filter === 'title'}
                        onClick={() => setFilter('title')}
                    >
                        Movies ({store.getBookmarksByType('title').length})
                    </FilterTab>
                    <FilterTab
                        $active={filter === 'person'}
                        onClick={() => setFilter('person')}
                    >
                        Actors ({store.getBookmarksByType('person').length})
                    </FilterTab>
                </FilterTabs>
            </Header>

            {store.isLoading ? (
                <LoadingText>Loading bookmarks...</LoadingText>
            ) : filteredBookmarks.length === 0 ? (
                <EmptyText>
                    {filter === 'all'
                        ? 'No bookmarks yet. Start adding some!'
                        : `No ${filter === 'title' ? 'movie' : 'actor'} bookmarks yet.`}
                </EmptyText>
            ) : (
                <BookmarkGrid>
                    {filteredBookmarks.map(bookmark => {
                        const linkPath = bookmark.targetType === 'title'
                            ? `/movies/${bookmark.targetId}`
                            : `/actors/${bookmark.targetId}`

                        return (
                            <BookmarkCard key={bookmark.id}>
                                <BookmarkLink to={linkPath}>
                                    {bookmark.note?.imageUrl ? (
                                        <BookmarkImage
                                            src={bookmark.note.imageUrl as string}
                                            alt={bookmark.note.title as string || 'Bookmark'}
                                        />
                                    ) : (
                                        <BookmarkType>
                                            {bookmark.targetType === 'title' ? '🎬' : '👤'}
                                        </BookmarkType>
                                    )}
                                    <BookmarkContent>
                                        <BookmarkTitle>
                                            {bookmark.note?.title as string || bookmark.targetId}
                                        </BookmarkTitle>
                                        <BookmarkDate>
                                            {new Date(bookmark.addedAt).toLocaleDateString()}
                                        </BookmarkDate>
                                    </BookmarkContent>
                                </BookmarkLink>
                                <RemoveButton
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleRemove(bookmark.targetId, bookmark.targetType)
                                    }}
                                    title="Remove bookmark"
                                >
                                    ✕
                                </RemoveButton>
                            </BookmarkCard>
                        )
                    })}
                </BookmarkGrid>
            )}
        </Container>
    )
}

// === Styled Components ===

const Container = styled.section`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`

const Header = styled.div`
    margin-bottom: 2rem;
`

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #a855f7, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const FilterTabs = styled.div`
    display: flex;
    gap: 1rem;
`

const FilterTab = styled.button<{ $active: boolean }>`
    background: ${props => props.$active
        ? 'linear-gradient(to right, #a855f7, #ec4899)'
        : 'rgba(55, 65, 81, 0.4)'};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
`

const LoadingText = styled.p`
    color: #9ca3af;
    text-align: center;
    padding: 2rem;
`

const EmptyText = styled.p`
    color: #9ca3af;
    text-align: center;
    padding: 3rem;
    background: rgba(55, 65, 81, 0.2);
    border-radius: 0.5rem;
`

const BookmarkGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
`

const BookmarkCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(55, 65, 81, 0.4);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: background 0.2s ease;

    &:hover {
        background: rgba(55, 65, 81, 0.6);
    }
`

const BookmarkLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    text-decoration: none;
    color: inherit;
    
    &:hover {
        opacity: 0.8;
    }
`

const BookmarkImage = styled.img`
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 0.25rem;
`

const BookmarkContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`

const BookmarkType = styled.span`
    font-size: 1.5rem;
    width: 60px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
`

const BookmarkTitle = styled.span`
    font-weight: 500;
    color: #e5e7eb;
`

const BookmarkDate = styled.span`
    font-size: 0.75rem;
    color: #6b7280;
`

const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem;
    transition: color 0.2s ease;

    &:hover {
        color: #ef4444;
    }
`
