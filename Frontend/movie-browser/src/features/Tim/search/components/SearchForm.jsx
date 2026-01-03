// @ts-nocheck
import { observer } from 'mobx-react';
import { useState, useRef, useEffect } from 'react';
import { Form, InputGroup, Button, Dropdown, ButtonGroup, ListGroup } from 'react-bootstrap';
import { searchStore } from '../store/SearchStore';

/**
 * @fileoverview Search Input Form with Bootstrap Dropdown.
 * Fixed version using local state for input to prevent focus loss.
 */
const SearchFormBase = ({ className = '' }) => {
    const instanceId = useRef(Math.random().toString(36).substr(2, 5));
    console.log('[SearchForm ' + instanceId.current + '] RENDER. isAdvancedSearch: ', searchStore.isAdvancedSearch);

    // Local state for input to prevent focus loss during MobX updates
    const [inputValue, setInputValue] = useState(searchStore.query);
    const [searchType, setSearchType] = useState(searchStore.searchType);
    const [isFocused, setIsFocused] = useState(false);

    // Sync local searchType with store when it changes externally
    useEffect(() => {
        setSearchType(searchStore.searchType);

        // Initial history fetch
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const userUser = JSON.parse(userJson);
                if (userUser.id || userUser.userId) {
                    searchStore.fetchSearchHistory(userUser.id || userUser.userId);
                }
            }
        } catch (e) {
            console.error('Error parsing user from local storage', e);
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
        <Form
            id="main-search-form"
            onSubmit={handleSearch}
            className={`w-100 ${className}`}
            style={{ maxWidth: '600px', margin: '0 auto' }}
        >
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
                        try {
                            const userJson = localStorage.getItem('user');
                            if (userJson) {
                                const userUser = JSON.parse(userJson);
                                if (userUser.id || userUser.userId) {
                                    searchStore.fetchSearchHistory(userUser.id || userUser.userId);
                                }
                            }
                        } catch (e) { }
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

                <Dropdown as={ButtonGroup}>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={searchStore.isSearching}
                    >
                        {searchStore.isSearching ? '...' : 'Search'}
                    </Button>
                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />
                    <Dropdown.Menu align="end">
                        <Dropdown.Item
                            active={!searchStore.isAdvancedSearch}
                            onClick={() => {
                                console.log('[SearchForm] Simple Search clicked');
                                searchStore.setAdvancedSearch(false);
                            }}
                        >
                            Simple Search
                        </Dropdown.Item>
                        <Dropdown.Item
                            active={searchStore.isAdvancedSearch}
                            onClick={() => {
                                console.log('[SearchForm] Advanced Search clicked');
                                searchStore.setAdvancedSearch(true);
                            }}
                        >
                            Advanced Search (Structured)
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

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

            {/* Advanced Search Fields */}
            {searchStore.isAdvancedSearch && (
                <div
                    className="position-absolute w-100 mt-2 p-3 bg-dark border border-secondary rounded shadow-lg"
                    style={{ top: '100%', left: 0, zIndex: 2000 }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-white-50 small text-uppercase fw-bold mb-0">Structured Search (1-D.4)</h6>
                        <Button
                            variant="link"
                            size="sm"
                            className="text-white-50 p-0 text-decoration-none"
                            style={{ fontSize: '1.2rem', lineHeight: '1' }}
                            onClick={() => searchStore.setAdvancedSearch(false)}
                            title="Close"
                        >
                            &times;
                        </Button>
                    </div>
                    <div className="row g-2">
                        <div className="col-md-6">
                            <Form.Control
                                size="sm"
                                placeholder="Title contains..."
                                className="bg-secondary text-white border-0"
                                onChange={(e) => searchStore.setStructuredQueryField('title', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Control
                                size="sm"
                                placeholder="Plot contains..."
                                className="bg-secondary text-white border-0"
                                onChange={(e) => searchStore.setStructuredQueryField('plot', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Control
                                size="sm"
                                placeholder="Character name..."
                                className="bg-secondary text-white border-0"
                                onChange={(e) => searchStore.setStructuredQueryField('character', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Control
                                size="sm"
                                placeholder="Actor/Person name..."
                                className="bg-secondary text-white border-0"
                                onChange={(e) => searchStore.setStructuredQueryField('name', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}


        </Form>
    );
};

// Export both the base component and the observer-wrapped version
export { SearchFormBase };
export const SearchForm = observer(SearchFormBase);
