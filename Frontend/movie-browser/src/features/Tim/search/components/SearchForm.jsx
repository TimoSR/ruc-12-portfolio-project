// @ts-nocheck
import { observer } from "mobx-react";
import { useState, useEffect } from "react";
import { Form, InputGroup, Button, Dropdown, ListGroup } from "react-bootstrap";
import { searchStore } from "../store/SearchStore";

/**
 * @fileoverview Search Input Form with Bootstrap Dropdown.
 * Fixed version using local state for input to prevent focus loss.
 */
const SearchFormBase = ({ className = '' }) => {
    // Local state for input to prevent focus loss during MobX updates
    const [inputValue, setInputValue] = useState(searchStore.query);
    const [searchType, setSearchType] = useState(searchStore.searchType);
    const [isFocused, setIsFocused] = useState(false);

    // Sync local searchType with store when it changes externally
    useEffect(() => {
        setSearchType(searchStore.searchType);

        // Initial history fetch
        const userUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (userUser.id || userUser.userId) {
            searchStore.fetchSearchHistory(userUser.id || userUser.userId);
        }
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
        searchStore.setResultsVisible(true); // Show results when typing
        searchStore.searchDebounced(500);
    };

    // Get label for dropdown button
    const typeLabel = searchType === 'movie' ? 'Movies'
        : searchType === 'person' ? 'People'
            : 'All';

    return (
        <Form id="main-search-form" onSubmit={handleSearch} className={`w-100 ${className}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                    onFocus={() => {
                        setIsFocused(true);
                        searchStore.setResultsVisible(true); // Show results when focused
                        // Refresh history when focusing
                        const userUser = JSON.parse(localStorage.getItem('user') || '{}');
                        if (userUser.id || userUser.userId) {
                            searchStore.fetchSearchHistory(userUser.id || userUser.userId);
                        }
                    }}
                    onBlur={() => {
                        // Delay hiding so clicks on items register
                        setTimeout(() => setIsFocused(false), 200);
                    }}
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

                {/* History Dropdown */}
                {isFocused && inputValue.trim() === '' && searchStore.history.length > 0 && (
                    <div className="position-absolute w-100" style={{ top: '100%', left: 0, zIndex: 1050 }}>
                        <ListGroup className="shadow-sm mt-1">
                            <ListGroup.Item variant="dark" className="text-muted small py-1 bg-dark border-secondary">
                                Recent Searches
                            </ListGroup.Item>
                            {searchStore.history.slice(0, 10).map((item) => (
                                <ListGroup.Item
                                    key={item.id || item.timestamp}
                                    className="bg-dark text-white border-secondary action-item"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        const query = item.query;
                                        setInputValue(query);
                                        searchStore.setQuery(query);
                                        searchStore.searchNow();
                                        setIsFocused(false);
                                    }}
                                >
                                    🕒 {item.query}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </InputGroup>
        </Form>
    );
};

// Export both the base component and the observer-wrapped version
export { SearchFormBase };
export const SearchForm = observer(SearchFormBase);

