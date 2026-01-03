// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import { Link } from "@tanstack/react-router";

/**
 * @fileoverview Displays similar movies for a title.
 * Implements frontend support for requirement 1-D.9.
 * Fetches from /api/v1/titles/{titleId}/similar
 * 
 * @param {object} props
 * @param {string} props.tconst - Movie ID (GUID or legacy)
 */
export const SimilarMovies = ({ tconst }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tconst) {
            setLoading(false);
            return;
        }

        const fetchSimilarMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                // tconst could be a GUID or legacyId - try GUID first
                const res = await fetch(`http://localhost:5001/api/v1/titles/${tconst}/similar?limit=5`);

                if (res.ok) {
                    const data = await res.json();
                    setMovies(data);
                } else {
                    // Maybe it's a legacy ID, ignore errors gracefully
                    setMovies([]);
                }
            } catch (err) {
                console.error('Failed to fetch similar movies:', err);
                setError('Could not load similar movies');
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarMovies();
    }, [tconst]);

    if (!tconst) return null;

    if (loading) {
        return (
            <Card className="bg-dark text-white border-secondary mt-4">
                <Card.Header className="border-secondary">
                    <div className="fw-bold">You Might Also Like</div>
                </Card.Header>
                <Card.Body className="text-center">
                    <Spinner animation="border" size="sm" variant="secondary" />
                    <span className="ms-2 text-muted">Loading...</span>
                </Card.Body>
            </Card>
        );
    }

    if (error || movies.length === 0) {
        return (
            <Card className="bg-dark text-white border-secondary mt-4">
                <Card.Header className="border-secondary">
                    <div className="fw-bold">You Might Also Like</div>
                </Card.Header>
                <Card.Body>
                    <span className="text-muted">
                        {error || 'No similar movies found'}
                    </span>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="bg-dark text-white border-secondary mt-4">
            <Card.Header className="border-secondary">
                <div className="fw-bold">You Might Also Like</div>
                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    Based on shared genres
                </div>
            </Card.Header>
            <ListGroup variant="flush">
                {movies.map(m => (
                    <ListGroup.Item
                        key={m.titleId}
                        as={Link}
                        to={`/movies/${m.titleId}`}
                        className="bg-transparent text-white border-secondary d-flex justify-content-between align-items-center text-decoration-none"
                        style={{ cursor: 'pointer', transition: 'background-color 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div>
                            <span>{m.primaryTitle}</span>
                        </div>
                        <Badge bg="dark" className="border border-secondary">
                            {Math.round(m.similarity * 100)}%
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};
