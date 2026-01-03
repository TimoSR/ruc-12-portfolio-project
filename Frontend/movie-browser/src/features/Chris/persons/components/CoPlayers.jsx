// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import { Link } from "@tanstack/react-router";

/**
 * @fileoverview Displays frequent co-players for an actor.
 * Implements frontend support for requirement 1-D.6.
 * Fetches from /api/v1/persons/{personName}/co-actors
 * 
 * @param {object} props
 * @param {string} props.nconst - Actor ID (nconst or name)
 * @param {string} [props.personName] - Actor name for API call
 */
export const CoPlayers = ({ nconst, personName }) => {
    const [coActors, setCoActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!personName && !nconst) {
            setLoading(false);
            return;
        }

        const fetchCoActors = async () => {
            setLoading(true);
            setError(null);
            try {
                // The API uses personName as the path param
                // Try personName if provided, otherwise fall back to nconst
                const nameToUse = personName || nconst;

                const res = await fetch(`http://localhost:5001/api/v1/persons/${encodeURIComponent(nameToUse)}/co-actors`);

                if (res.ok) {
                    const data = await res.json();
                    // Take top 5 co-actors
                    setCoActors(data.slice(0, 5));
                } else {
                    // API might fail if name format doesn't match - handle gracefully
                    setCoActors([]);
                }
            } catch (err) {
                console.error('Failed to fetch co-actors:', err);
                setError('Could not load co-players');
            } finally {
                setLoading(false);
            }
        };

        fetchCoActors();
    }, [nconst, personName]);

    if (!nconst && !personName) return null;

    if (loading) {
        return (
            <Card className="bg-dark text-white border-secondary mt-4">
                <Card.Header className="border-secondary">
                    <div className="fw-bold">Often Acts With</div>
                </Card.Header>
                <Card.Body className="text-center">
                    <Spinner animation="border" size="sm" variant="secondary" />
                    <span className="ms-2 text-muted">Loading...</span>
                </Card.Body>
            </Card>
        );
    }

    if (error || coActors.length === 0) {
        return (
            <Card className="bg-dark text-white border-secondary mt-4">
                <Card.Header className="border-secondary">
                    <div className="fw-bold">Often Acts With</div>
                </Card.Header>
                <Card.Body>
                    <span className="text-muted">
                        {error || 'No co-players found'}
                    </span>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="bg-dark text-white border-secondary mt-4">
            <Card.Header className="border-secondary">
                <div className="fw-bold">Often Acts With</div>
                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    Based on shared movie appearances
                </div>
            </Card.Header>
            <ListGroup variant="flush">
                {coActors.map(p => (
                    <ListGroup.Item
                        key={p.personId}
                        as={Link}
                        to={`/persons/${p.personId}`}
                        className="bg-transparent text-white border-secondary d-flex justify-content-between align-items-center text-decoration-none"
                        style={{ cursor: 'default' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span>{p.primaryName || p.name || 'Unknown Actor'}</span>
                        <Badge bg="secondary" pill>{p.frequency} movies</Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};
