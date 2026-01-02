// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Tab, Tabs, Badge, Spinner } from 'react-bootstrap';
import { observer, useLocalObservable } from 'mobx-react';
import { useNavigate, Link } from '@tanstack/react-router';
import { searchStore } from '../../../Tim/search/store/SearchStore';
import { bookmarksStore } from '../../bookmarks/store/BookmarksStore';
import { ratingStore } from '../../movies/store/RatingStore';
import { AuthStore } from '../store/AuthStore';

/**
 * @fileoverview User Profile View.
 * Displays user's search history, bookmarks, and ratings.
 * Requirement 1-D.2, 1-D.6, 1-D.9 visualization.
 */

// Component to fetch and display a single bookmarked movie
const EnrichedBookmarkItem = ({ bookmark }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookmark.type !== 'movie') {
            setLoading(false);
            return;
        }

        const fetchMovie = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/v1/titles/${bookmark.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMovie(data);
                }
            } catch (err) {
                console.error('Failed to fetch movie for bookmark', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [bookmark.id, bookmark.type]);

    if (loading) {
        return (
            <ListGroup.Item className="bg-dark text-white d-flex align-items-center gap-3">
                <Spinner animation="border" size="sm" />
                <span>Loading...</span>
            </ListGroup.Item>
        );
    }

    if (bookmark.type === 'person') {
        return (
            <ListGroup.Item className="bg-dark text-white d-flex align-items-center gap-3">
                <span style={{ fontSize: '1.5rem' }}>👤</span>
                <span><strong>Person ID:</strong> {bookmark.id}</span>
                <Badge bg="secondary">person</Badge>
            </ListGroup.Item>
        );
    }

    return (
        <ListGroup.Item
            as={Link}
            to={`/movies/${bookmark.id}`}
            className="bg-dark text-white d-flex align-items-center gap-3 text-decoration-none"
            style={{ cursor: 'pointer' }}
        >
            {movie?.posterUrl ? (
                <img
                    src={movie.posterUrl}
                    alt={movie.primaryTitle}
                    style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ) : (
                <div style={{ width: '50px', height: '75px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🎬
                </div>
            )}
            <div style={{ flex: 1 }}>
                <strong>{movie?.primaryTitle || 'Unknown Movie'}</strong>
                {movie?.startYear && <span className="text-muted ms-2">({movie.startYear})</span>}
            </div>
            <Badge bg="warning" text="dark">movie</Badge>
        </ListGroup.Item>
    );
};

// Component to fetch and display a single rated movie
const EnrichedRatingItem = ({ rating }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // tconst could be a GUID or legacy ID
                const res = await fetch(`http://localhost:5001/api/v1/titles/${rating.tconst}`);
                if (res.ok) {
                    const data = await res.json();
                    setMovie(data);
                }
            } catch (err) {
                console.error('Failed to fetch movie for rating', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [rating.tconst]);

    if (loading) {
        return (
            <ListGroup.Item className="bg-dark text-white d-flex align-items-center gap-3">
                <Spinner animation="border" size="sm" />
                <span>Loading...</span>
            </ListGroup.Item>
        );
    }

    return (
        <ListGroup.Item
            as={Link}
            to={`/movies/${rating.tconst}`}
            className="bg-dark text-white d-flex align-items-center gap-3 text-decoration-none"
            style={{ cursor: 'pointer' }}
        >
            {movie?.posterUrl ? (
                <img
                    src={movie.posterUrl}
                    alt={movie?.primaryTitle}
                    style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ) : (
                <div style={{ width: '50px', height: '75px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🎬
                </div>
            )}
            <div style={{ flex: 1 }}>
                <strong>{movie?.primaryTitle || 'Unknown Movie'}</strong>
                {movie?.startYear && <span className="text-muted ms-2">({movie.startYear})</span>}
            </div>
            <span className="text-warning" style={{ fontSize: '1.2rem' }}>
                {'★'.repeat(rating.rating)}{'☆'.repeat(10 - rating.rating)}
            </span>
        </ListGroup.Item>
    );
};

export const UserProfileView = observer(() => {
    const navigate = useNavigate();

    // Use Real AuthStore
    const authStore = useLocalObservable(() => new AuthStore());
    const userId = authStore.id;

    useEffect(() => {
        if (!userId) return; // Wait for login/load

        // Load data on mount
        searchStore.fetchSearchHistory(userId);
        bookmarksStore.fetchUserBookmarks(userId);
        ratingStore.fetchUserRatings(userId);
    }, [userId]);

    const handleHistoryClick = (query) => {
        searchStore.setQuery(query);
        searchStore.searchNow();
        navigate({ to: '/' }); // Go to home/search page
    };

    return (
        <Container className="py-5">
            <h1 className="mb-4 text-white">My Profile</h1>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="bg-dark text-white border-secondary">
                        <Card.Body>
                            <Card.Title>User Overview</Card.Title>
                            <Card.Text>
                                Welcome back! Here is your activity summary.
                            </Card.Text>
                            <div className="d-flex gap-3">
                                <Badge bg="primary" className="p-2">
                                    History: {searchStore.history.length}
                                </Badge>
                                <Badge bg="warning" className="text-dark p-2">
                                    Bookmarks: {bookmarksStore.bookmarks.length}
                                </Badge>
                                <Badge bg="info" className="p-2">
                                    Ratings: {ratingStore.ratings.length}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="history" id="profile-tabs" className="mb-4" variant="pills">

                {/* TAB: SEARCH HISTORY */}
                <Tab eventKey="history" title="Search History">
                    <Card className="bg-dark border-secondary text-white">
                        <Card.Header>Recent Searches</Card.Header>
                        <ListGroup variant="flush">
                            {searchStore.history.length === 0 ? (
                                <ListGroup.Item className="bg-dark text-white-50">No history found.</ListGroup.Item>
                            ) : (
                                searchStore.history.map((item) => (
                                    <ListGroup.Item
                                        key={item.id}
                                        className="bg-dark text-white d-flex justify-content-between align-items-center action-item"
                                        action
                                        onClick={() => handleHistoryClick(item.query)}
                                    >
                                        <span>
                                            <span className="fw-bold me-2">🔍</span>
                                            {item.query}
                                        </span>
                                        <small className="text-muted">
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </small>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Tab>

                {/* TAB: BOOKMARKS */}
                <Tab eventKey="bookmarks" title="Bookmarks">
                    <Card className="bg-dark border-secondary text-white">
                        <Card.Header>My Bookmarks</Card.Header>
                        <ListGroup variant="flush">
                            {bookmarksStore.bookmarks.length === 0 ? (
                                <ListGroup.Item className="bg-dark text-white-50">No bookmarks yet.</ListGroup.Item>
                            ) : (
                                bookmarksStore.bookmarks.map(b => (
                                    <EnrichedBookmarkItem key={b.id + b.type} bookmark={b} />
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Tab>

                {/* TAB: RATINGS */}
                <Tab eventKey="ratings" title="Ratings">
                    <Card className="bg-dark border-secondary text-white">
                        <Card.Header>My Ratings</Card.Header>
                        <ListGroup variant="flush">
                            {ratingStore.ratings.length === 0 ? (
                                <ListGroup.Item className="bg-dark text-white-50">No ratings yet.</ListGroup.Item>
                            ) : (
                                ratingStore.ratings.map((r, idx) => (
                                    <EnrichedRatingItem key={idx} rating={r} />
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Tab>

            </Tabs>
        </Container>
    );
});
