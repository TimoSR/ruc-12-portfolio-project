// @ts-nocheck
import { observer } from "mobx-react";
import { Card, ListGroup, Badge, Alert, Spinner, Button } from "react-bootstrap";
import { searchStore } from "../store/SearchStore";
import { BookmarkButton } from "../../../Chris/bookmarks/components/BookmarkButton";

/**
 * @fileoverview Search Results Display.
 * Replaces old SearchResults.tsx to use React Bootstrap + New Store.
 * Implements requirement 3-E.5 (Displaying results).
 */
const SearchResultsBase = () => {
    const { results, isSearching, error, query } = searchStore;

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
                        <div>
                            <div className="fw-bold">{item.title || item.name}</div>
                            <small className="text-muted">{item.description}</small>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <Badge bg={item.type === 'movie' ? 'primary' : 'success'}>
                                {item.type === 'movie' ? 'Movie' : 'Person'}
                            </Badge>

                            {/* Bookmark - stop propagation så klik ikke navigerer */}
                            <span onClick={(e) => e.stopPropagation()}>
                                <BookmarkButton
                                    targetId={item.id}
                                    targetType={item.type}
                                    displayName={item.title || item.name}
                                />
                            </span>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export const SearchResults = observer(SearchResultsBase);
