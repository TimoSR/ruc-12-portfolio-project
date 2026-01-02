// @ts-nocheck
import { observer } from "mobx-react";
import { Card, ListGroup, Badge, Alert, Spinner, Button } from "react-bootstrap";
import { searchStore } from "../store/SearchStore";

/**
 * @fileoverview Search Results Display.
 * Replaces old SearchResults.tsx to use React Bootstrap + New Store.
 * Implements requirement 3-E.5 (Displaying results).
 */
import { fetchTmdbPersonImage, fetchTmdbMovieImage } from "../../../../api/tmdbService";
import { useState, useEffect } from "react";

const ResultImage = ({ id, type, alt }) => {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            const fetcher = type === 'movie' ? fetchTmdbMovieImage : fetchTmdbPersonImage;
            const url = await fetcher(id);
            if (mounted) setSrc(url);
        };
        load();
        return () => { mounted = false; };
    }, [id, type]);

    if (!src) return <div style={{ width: 50, height: 75, background: '#333' }} className="rounded me-3" />;

    return (
        <img
            src={src}
            alt={alt}
            className="rounded me-3 object-fit-cover"
            style={{ width: 50, height: 75 }}
        />
    );
};

const SearchResultsBase = () => {
    const { results, isSearching, error, query, isResultsVisible } = searchStore;

    if (!isResultsVisible) return null;

    if (error) {
        return (
            <Alert variant="danger" className="mt-3">
                {error}
            </Alert>
        );
    }

    if (isSearching) {
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    if (results.length === 0 && query.trim().length > 0) {
        return (
            <Alert variant="secondary" className="mt-3 text-center">
                No results found for "<strong>{query}</strong>"
            </Alert>
        );
    }

    if (results.length === 0) return null;

    return (
        <div className="mt-4 search-results-container">
            <h5 className="text-white mb-3 border-bottom pb-2">
                Results ({results.length})
            </h5>
            <ListGroup variant="flush">
                {results.map((item) => (
                    <ListGroup.Item
                        key={item.id}
                        action
                        href={`/${item.type === 'movie' ? 'movies' : 'persons'}/${item.id}`}
                        className="bg-dark text-white border-secondary mb-2 rounded d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center">
                            <ResultImage id={item.id} type={item.type} alt={item.title || item.name} />
                            <div>
                                <div className="fw-bold">{item.title || item.name}</div>
                                <small className="text-muted">{item.description}</small>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <Badge bg={item.type === 'movie' ? 'primary' : 'success'}>
                                {item.type === 'movie' ? 'Movie' : 'Person'}
                            </Badge>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export const SearchResults = observer(SearchResultsBase);
