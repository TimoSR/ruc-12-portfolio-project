// @ts-nocheck
import { observer } from "mobx-react";
import { useState, useEffect } from "react";
import { Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { searchStore } from "../store/SearchStore";

/**
 * @fileoverview Search Input Form with Bootstrap Dropdown.
 * Fixed version using local state for input to prevent focus loss.
 */
const SearchFormBase = ({ className = '' }) => {
    // Local state for input to prevent focus loss during MobX updates
    const [inputValue, setInputValue] = useState(searchStore.query);
    const [searchType, setSearchType] = useState(searchStore.searchType);

    // Sync local searchType with store when it changes externally
    useEffect(() => {
        setSearchType(searchStore.searchType);
    }, [searchStore.searchType]);

    const handleSearch = (e) => {
        e.preventDefault();
        searchStore.setQuery(inputValue);
        searchStore.searchNow();
    };

    const handleTypeSelect = (eventKey) => {
        console.log('[SearchForm] Type selected:', eventKey);
        setSearchType(eventKey); // Update local state immediately
        searchStore.setSearchType(eventKey);
        if (inputValue.trim()) {
            searchStore.setQuery(inputValue);
            searchStore.searchNow();
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value); // Update local state for responsive UI
        searchStore.setQuery(value);
        searchStore.searchDebounced(500);
    };

    // Get label for dropdown button
    const typeLabel = searchType === 'movie' ? 'Movies'
        : searchType === 'person' ? 'People'
            : 'All';

    return (
        <Form onSubmit={handleSearch} className={`w-100 ${className}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <InputGroup>
                {/* Custom Dropdown using Bootstrap Dropdown */}
                <Dropdown onSelect={handleTypeSelect}>
                    <Dropdown.Toggle variant="secondary" id="search-type-dropdown">
                        {typeLabel}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="all" active={searchType === 'all'}>All</Dropdown.Item>
                        <Dropdown.Item eventKey="movie" active={searchType === 'movie'}>Movies</Dropdown.Item>
                        <Dropdown.Item eventKey="person" active={searchType === 'person'}>People</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Form.Control
                    type="search"
                    placeholder="Search IMDb..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="bg-dark text-white border-secondary"
                    style={{
                        color: '#ffffff',
                        backgroundColor: '#212529',
                        caretColor: 'white'
                    }}
                />

                <Button
                    variant="primary"
                    type="submit"
                    disabled={searchStore.isSearching}
                >
                    {searchStore.isSearching ? '...' : 'Search'}
                </Button>
            </InputGroup>
        </Form>
    );
};

// Export both the base component and the observer-wrapped version
export { SearchFormBase };
export const SearchForm = observer(SearchFormBase);

