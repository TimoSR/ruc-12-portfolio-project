// @ts-nocheck
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { bookmarksStore } from "../store/BookmarksStore";
import { BookmarkButton } from "../components/BookmarkButton";

/**
 * @fileoverview View page for User Bookmarks.
 * Displays a grid of bookmarked movies and people.
 */
const BookmarksViewBase = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                const uid = parsed.id || parsed.userId;
                setUserId(uid);
                // Load data on mount
                bookmarksStore.fetchUserBookmarks(uid);
            } catch (e) { console.error(e); }
        }
    }, []);

    if (!userId) {
        return (
            <Container className="py-5">
                <Alert variant="info">Please log in to view your bookmarks.</Alert>
            </Container>
        );
    }

    const { bookmarks, isLoading } = bookmarksStore;
    const movies = bookmarks.filter(b => b.type === 'movie');
    const people = bookmarks.filter(b => b.type === 'person');

    return (
        <Container className="py-4">
            <h1 className="mb-4 text-white">My Bookmarks</h1>

            {isLoading && <Spinner animation="border" variant="light" />}

            {!isLoading && bookmarks.length === 0 && (
                <Alert variant="secondary">You haven't bookmarked anything yet.</Alert>
            )}

            {/* Movies Section */}
            {movies.length > 0 && (
                <>
                    <h3 className="text-white mt-4 border-bottom pb-2">Movies</h3>
                    <Row className="g-4 mt-1">
                        {movies.map(item => (
                            <Col key={item.id} xs={6} md={4} lg={3}>
                                <Card className="h-100 bg-dark text-white border-secondary">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <Card.Title className="h6">{item.title || 'Unknown Title'}</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <small className="text-muted">{item.id}</small>
                                            <BookmarkButton
                                                targetId={item.id}
                                                targetType="movie"
                                                displayName={item.title}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {/* People Section */}
            {people.length > 0 && (
                <>
                    <h3 className="text-white mt-5 border-bottom pb-2">People</h3>
                    <Row className="g-4 mt-1">
                        {people.map(item => (
                            <Col key={item.id} xs={6} md={4} lg={3}>
                                <Card className="h-100 bg-dark text-white border-secondary">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <Card.Title className="h6">{item.name || 'Unknown Person'}</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <small className="text-muted">{item.id}</small>
                                            <BookmarkButton
                                                targetId={item.id}
                                                targetType="person"
                                                displayName={item.name}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export const BookmarksView = observer(BookmarksViewBase);
