// @ts-nocheck
import { Card, ListGroup, Badge } from "react-bootstrap";

/**
 * @fileoverview Displays frequent co-players for an actor.
 * Implements frontend support for requirement 1-D.6.
 * Currently uses MOCKED DATA until backend is ready.
 * 
 * @param {object} props
 * @param {string} props.nconst - Actor ID
 */
export const CoPlayers = ({ nconst }) => {
    // MOCK DATA - In real app, fetch from /api/v1/persons/{nconst}/coplayers
    const mockCoPlayers = [
        { nconst: 'nm0000158', name: 'Tom Hanks', count: 5 },
        { nconst: 'nm0000204', name: 'Natalie Portman', count: 3 },
        { nconst: 'nm0000151', name: 'Morgan Freeman', count: 3 },
    ];

    if (!nconst) return null;

    return (
        <Card className="bg-dark text-white border-secondary mt-4">
            <Card.Header className="border-secondary text-uppercase small text-muted">
                Frequent Co-Players (1-D.6)
            </Card.Header>
            <ListGroup variant="flush">
                {mockCoPlayers.map(p => (
                    <ListGroup.Item
                        key={p.nconst}
                        className="bg-transparent text-white border-secondary d-flex justify-content-between align-items-center"
                    >
                        <span>{p.name}</span>
                        <Badge bg="secondary" pill>{p.count} movies</Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};
