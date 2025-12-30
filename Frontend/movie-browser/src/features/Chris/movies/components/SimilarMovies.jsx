// @ts-nocheck
import { Card, ListGroup, Badge } from "react-bootstrap";

/**
 * @fileoverview Displays similar movies for a title.
 * Implements frontend support for requirement 1-D.9.
 * Currently uses MOCKED DATA until backend is ready.
 * 
 * @param {object} props
 * @param {string} props.tconst - Movie ID
 */
export const SimilarMovies = ({ tconst }) => {
    // MOCK DATA - In real app, fetch from /api/v1/titles/{tconst}/similar
    const mockSimilar = [
        { tconst: 'tt0110912', primaryTitle: 'Reservoir Dogs', year: 1992 },
        { tconst: 'tt0107290', primaryTitle: 'Jurassic Park', year: 1993 },
        { tconst: 'tt0111161', primaryTitle: 'The Shawshank Redemption', year: 1994 },
    ];

    if (!tconst) return null;

    return (
        <Card className="bg-dark text-white border-secondary mt-4">
            <Card.Header className="border-secondary text-uppercase small text-muted">
                Similar Movies (1-D.9)
            </Card.Header>
            <ListGroup variant="flush">
                {mockSimilar.map(m => (
                    <ListGroup.Item
                        key={m.tconst}
                        className="bg-transparent text-white border-secondary d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <span>{m.primaryTitle}</span>
                            <span className="text-muted small ms-2">({m.year})</span>
                        </div>
                        <Badge bg="dark" className="border border-secondary">Ref</Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};
