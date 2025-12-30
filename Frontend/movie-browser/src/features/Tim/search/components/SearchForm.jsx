// @ts-nocheck
import { observer } from "mobx-react";
import { useState } from "react";
import { Form, InputGroup, Button, FormCheck } from "react-bootstrap";
import { searchStore } from "../store/SearchStore";

/**
 * @fileoverview Search Input Form with Toggle.
 * Replaces old SearchInput.tsx to use React Bootstrap + New Store.
 * Implements requirement 3-E.5 (Search movies & people).
 */
const SearchFormBase = ({ className = '' }) => {
    const [localQuery, setLocalQuery] = useState(searchStore.query);

    const handleSearch = (e) => {
        e.preventDefault();
        searchStore.setQuery(localQuery);
        searchStore.searchNow();
    };

    const handleTypeChange = (type) => {
        searchStore.setSearchType(type);
    };

    return (
        <Form onSubmit={handleSearch} className={`w-100 ${className}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <InputGroup className="mb-2">
                <InputGroup.Text className="bg-dark text-white border-secondary">
                    🔍
                </InputGroup.Text>

                <Form.Control
                    type="search"
                    placeholder={`Search for ${searchStore.searchType === 'movie' ? 'movies' : 'people'}...`}
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="bg-dark text-white border-secondary"
                    autoFocus
                />

                <Button
                    variant="primary"
                    type="submit"
                    disabled={searchStore.isSearching}
                >
                    {searchStore.isSearching ? '...' : 'Search'}
                </Button>
            </InputGroup>

            {/* Search Type Toggle */}
            <div className="d-flex justify-content-center gap-4 text-white">
                <FormCheck
                    type="radio"
                    id="search-movie"
                    label="Movies"
                    name="searchType"
                    checked={searchStore.searchType === 'movie'}
                    onChange={() => handleTypeChange('movie')}
                    className="user-select-none"
                    style={{ cursor: 'pointer' }}
                />
                <FormCheck
                    type="radio"
                    id="search-person"
                    label="People"
                    name="searchType"
                    checked={searchStore.searchType === 'person'}
                    onChange={() => handleTypeChange('person')}
                    className="user-select-none"
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </Form>
    );
};

export const SearchForm = observer(SearchFormBase);
