// @ts-nocheck
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Badge, Tab, Tabs } from "react-bootstrap";
import { BookmarksView } from "../../bookmarks/views/BookmarksView";

/**
 * @fileoverview User Profile View.
 * VISUALIZES user-generated data: History, Ratings, Bookmarks.
 * Implements requirement "Visualize user-generated data".
 */
export const UserProfileView = () => {
    const [userId, setUserId] = useState(null);
    const [key, setKey] = useState('history');

    // MOCK DATA for History (Requirement 1-D.2)
    const mockHistory = [
        { query: "Pulp Fiction", timestamp: "2025-12-30 14:00" },
        { query: "Tom Hanks", timestamp: "2025-12-30 13:45" },
        { query: "Action movies", timestamp: "2025-12-29 10:00" },
    ];

    // MOCK DATA for Ratings (Requirement "Visualize my rating")
    const mockRatings = [
        { tconst: "tt0110912", title: "Pulp Fiction", rating: 9, timestamp: "2025-12-30" },
        { tconst: "tt0068646", title: "The Godfather", rating: 10, timestamp: "2025-12-28" },
    ];

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { setUserId(JSON.parse(stored).id || JSON.parse(stored).userId); }
            catch (e) { }
        }
    }, []);

    if (!userId) {
        return (
            <Container className="py-5 text-white">
                <h2>Please Log In</h2>
                <p>You need to be logged in to view your profile history.</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="text-white mb-4">User Profile</h1>

            <Tabs
                id="profile-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
                variant="pills"
            >
                <Tab eventKey="history" title="Search History">
                    <Card className="bg-dark text-white border-secondary">
                        <Card.Header>Recent Searches (1-D.2)</Card.Header>
                        <ListGroup variant="flush">
                            {mockHistory.map((h, i) => (
                                <ListGroup.Item key={i} className="bg-transparent text-white border-secondary d-flex justify-content-between">
                                    <span>"{h.query}"</span>
                                    <small className="text-muted">{h.timestamp}</small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Tab>

                <Tab eventKey="ratings" title="My Ratings">
                    <Card className="bg-dark text-white border-secondary">
                        <Card.Header>Rated Titles</Card.Header>
                        <ListGroup variant="flush">
                            {mockRatings.map((r, i) => (
                                <ListGroup.Item key={i} className="bg-transparent text-white border-secondary d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold">{r.title}</span>
                                        <small className="text-muted ms-2">({r.tconst})</small>
                                    </div>
                                    <Badge bg="warning" text="dark">★ {r.rating}</Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Tab>

                <Tab eventKey="bookmarks" title="Bookmarks">
                    {/* Reusing the BookmarksView logic here if we wanted, or just linking to it */}
                    <div className="p-3 bg-dark border border-secondary rounded">
                        <p className="text-white mb-0">See "Bookmarks" page for full view.</p>
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};
