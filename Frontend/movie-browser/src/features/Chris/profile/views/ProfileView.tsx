import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { useAuthStore } from '../../../auth/store/AuthStore'
import { ProfileStore } from '../store/ProfileStore'
import { Link } from '@tanstack/react-router'

export const ProfileView = observer(() => {
    const authStore = useAuthStore()
    const store = useLocalObservable(() => new ProfileStore(authStore))

    useEffect(() => {
        if (authStore.isAuthenticated) {
            void store.loadBookmarks()
        }
    }, [authStore.isAuthenticated])

    if (!authStore.isAuthenticated) {
        return (
            <Container>
                <Message>Please log in to view your profile.</Message>
            </Container>
        )
    }

    return (
        <Container>
            <Header>
                <Title>My Profile</Title>
                <Subtitle>Welcome back, {authStore.username}</Subtitle>
            </Header>

            <Section>
                <SectionTitle>My Bookmarks</SectionTitle>

                {store.isLoading && <Message>Loading bookmarks...</Message>}
                {store.error && <ErrorMessage>{store.error}</ErrorMessage>}

                {!store.isLoading && store.bookmarks.length === 0 && (
                    <Message>You haven't bookmarked anything yet.</Message>
                )}

                <Grid>
                    {store.bookmarks.map((bookmark, index) => {
                        const details = bookmark.details
                        if (!details) return null // Skip if details not loaded yet or failed

                        const isMovie = !!bookmark.titleId
                        const linkTo = isMovie ? '/movies/$movieId' : '/persons/$personId'
                        const params = isMovie ? { movieId: bookmark.titleId! } : { personId: bookmark.personId! }
                        const name = isMovie ? details.primaryTitle : details.primaryName
                        const image = isMovie ? details.posterUrl : null // Person image logic is complex, skip for now

                        return (
                            <Card key={index} to={linkTo} params={params}>
                                {image ? (
                                    <CardImage src={image} alt={name} />
                                ) : (
                                    <CardPlaceholder>{isMovie ? '🎬' : '👤'}</CardPlaceholder>
                                )}
                                <CardContent>
                                    <CardTitle>{name}</CardTitle>
                                    <CardType>{isMovie ? 'Movie' : 'Person'}</CardType>
                                    {bookmark.notes && <CardNote>Note: {bookmark.notes}</CardNote>}
                                </CardContent>
                            </Card>
                        )
                    })}
                </Grid>
            </Section>
        </Container>
    )
})

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`

const Header = styled.div`
    margin-bottom: 3rem;
`

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 800;
    color: #f9fafb;
    margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
    color: #9ca3af;
    font-size: 1.125rem;
`

const Section = styled.div`
    margin-bottom: 3rem;
`

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: #f9fafb;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
`

const Message = styled.p`
    color: #9ca3af;
    font-style: italic;
`

const ErrorMessage = styled.p`
    color: #fca5a5;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
`

const Card = styled(Link)`
    background: #1f2937;
    border-radius: 0.75rem;
    overflow: hidden;
    text-decoration: none;
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-4px);
        background: #374151;
    }
`

const CardImage = styled.img`
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
`

const CardPlaceholder = styled.div`
    width: 100%;
    aspect-ratio: 2/3;
    background: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
`

const CardContent = styled.div`
    padding: 1rem;
`

const CardTitle = styled.h3`
    color: #f9fafb;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const CardType = styled.span`
    color: #9ca3af;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`

const CardNote = styled.p`
    color: #d1d5db;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-style: italic;
`
