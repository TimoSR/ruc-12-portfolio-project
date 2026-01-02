// @ts-nocheck
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Tab, Tabs, Button, Badge } from 'react-bootstrap';
import { observer, useLocalObservable } from 'mobx-react';
import { useNavigate } from '@tanstack/react-router';
import { searchStore } from '../../../Tim/search/store/SearchStore';
import { bookmarksStore } from '../../bookmarks/store/BookmarksStore';
import { ratingStore } from '../../movies/store/RatingStore';
import { AuthStore } from '../store/AuthStore';

/**
 * @fileoverview User Profile View.
 * Displays user's search history, bookmarks, and ratings.
 * Requirement 1-D.2, 1-D.6, 1-D.9 visualization.
 */
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
                        <Card.Body>
                            {bookmarksStore.bookmarks.length === 0 ? (
                                <p className="text-muted">No bookmarks yet.</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {bookmarksStore.bookmarks.map(b => (
                                        <ListGroup.Item key={b.id + b.type} className="bg-dark text-white">
                                            {b.type === 'movie' ? '🎬' : '👤'} <strong>{b.title || b.name || b.id}</strong>
                                            <Badge bg="secondary" className="ms-2">{b.type}</Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
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
                                    <ListGroup.Item key={idx} className="bg-dark text-white d-flex justify-content-between">
                                        <span>Movie ID: {r.tconst}</span>
                                        <span className="text-warning">{'★'.repeat(r.rating)}</span>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Tab>

            </Tabs>
        </Container>
    );
});
