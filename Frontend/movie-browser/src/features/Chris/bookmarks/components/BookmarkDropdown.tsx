import { observer } from 'mobx-react'
import styled from 'styled-components'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useRootStore } from '../../../../store/RootStore'

export const BookmarkDropdown = observer(BookmarkDropdownBase)

function BookmarkDropdownBase() {
    const { bookmarkStore: store } = useRootStore()
    const bookmarks = store.bookmarks

    if (bookmarks.length === 0) {
        return null
    }

    return (
        <DropdownContainer>
            <DropdownHeader>Bookmarks</DropdownHeader>
            <List>
                {bookmarks.map(bookmark => (
                    <BookmarkItem
                        key={bookmark.id}
                        bookmark={bookmark}
                        onRemove={() => store.removeBookmark(bookmark.accountId, bookmark.targetId, bookmark.targetType)}
                    />
                ))}
            </List>
        </DropdownContainer>
    )
}

const DropdownContainer = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    width: 320px;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    padding: 0.5rem;
    z-index: 50;
    max-height: 400px;
    overflow-y: auto;
    margin-top: 0.5rem;
`

const DropdownHeader = styled.div`
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    color: #f3f4f6;
    border-bottom: 1px solid #374151;
    margin-bottom: 0.5rem;
`

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.2s;

    &:hover {
        background: #374151;
    }
`

const ItemLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    flex: 1;
    min-width: 0;
`

const Poster = styled.img`
    width: 40px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.25rem;
    background: #111827;
`

const PlaceholderIcon = styled.div`
    width: 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #374151;
    border-radius: 0.25rem;
    font-size: 1.25rem;
`

function BookmarkItem({ bookmark, onRemove }: { bookmark: any, onRemove: () => void }) {
    const [imageError, setImageError] = useState(false)

    return (
        <ListItem>
            <ItemLink
                to={bookmark.targetType === 'title' ? '/movies/$movieId' : '/'}
                params={bookmark.targetType === 'title' ? { movieId: bookmark.targetId } : {}}
            >
                {bookmark.posterUrl && !imageError ? (
                    <Poster
                        src={bookmark.posterUrl}
                        alt={bookmark.title || 'Bookmark'}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <PlaceholderIcon>{bookmark.targetType === 'title' ? '🎬' : '👤'}</PlaceholderIcon>
                )}
                <ItemInfo>
                    <ItemTitle>{bookmark.title || bookmark.targetId}</ItemTitle>
                    <ItemDate>{new Date(bookmark.addedAt).toLocaleDateString()}</ItemDate>
                </ItemInfo>
            </ItemLink>
            <RemoveButton
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove()
                }}
            >
                ✕
            </RemoveButton>
        </ListItem>
    )
}

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    overflow: hidden;
`

const ItemTitle = styled.span`
    color: #f3f4f6;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const ItemDate = styled.span`
    color: #9ca3af;
    font-size: 0.75rem;
`

const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    margin-left: 0.5rem;
    transition: color 0.2s;

    &:hover {
        color: #ef4444;
    }
`
