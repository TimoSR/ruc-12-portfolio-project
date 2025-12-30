# Feature Implementation Plan: JS & Bootstrap with JSDoc

This document outlines the plan to implement the remaining required features for the movie-browser frontend. 

**Strict Constraints:**
- **Language:** All new files must be **JavaScript** (`.jsx` / `.js`).
- **Documentation:** Use **JSDoc** comments for type documentation in all JS files.
- **Styling:** UI must be built using **React Bootstrap** components (no styled-components/tailwind in new files).
- **Architecture:** Must follow the existing `features/[Name]/[components|views|store]` pattern.
- **CSS:** Custom styling only via small overrides in a standard `.css` file.

## 0. DATABASE CHANGES (PROPOSAL FOR TIMO)
**IMPORTANT: DO NOT RUN THESE COMMANDS YET. WAITING FOR APPROVAL.**

To support the new features, we likely need the following tables in our Postgres database (Framework Model):

```sql
-- 1. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    user_id INT NOT NULL,  -- Provided by auth system
    target_id VARCHAR(50) NOT NULL, -- 'tconst' or 'nconst'
    target_type VARCHAR(10) NOT NULL, -- 'movie' or 'person'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, target_id)
);

-- 2. Ratings Table (for Titles)
CREATE TABLE IF NOT EXISTS title_ratings (
    user_id INT NOT NULL,
    tconst VARCHAR(50) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, tconst)
);

-- 3. Search History (Required by project description)
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    search_query TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 1. Prerequisites (Setup)

### 1.1 Install Dependencies
```bash
npm install react-bootstrap bootstrap
```

### 1.2 Import Bootstrap CSS
Add the following to `src/main.tsx`:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/overrides.css';
```

---

## 2. Feature: Rating of Titles

### 2.1 File Structure
**Location:** `src/features/Chris/movies/`
- `components/RatingControl.jsx` (New)
- `store/RatingStore.js` (New JS Store)

### 2.2 Component: `RatingControl.jsx`
- **Tech:** React Bootstrap, `.jsx`, **JSDoc**
- **Logic:**
  - Display 10 stars or input.
  - Calls `RatingStore.rateTitle()`.

### 2.3 Store: `RatingStore.js`
- **Tech:** MobX, `.js`, **JSDoc**
- **Logic:** Calls `rate(userId, titleId, rating)`. Gets `userId` from `localStorage` or `AuthStore`.

---

## 3. Feature: Bookmarks (Titles + People)

### 3.1 File Structure
**Location:** `src/features/Chris/bookmarks/`
- `components/BookmarkButton.jsx`
- `views/BookmarksView.jsx`
- `store/BookmarksStore.js`
- `index.ts` (Export file)

### 3.2 Component: `BookmarkButton.jsx`
- **Tech:** React Bootstrap (`Button`), `.jsx`, **JSDoc**
- **Props:** `targetId`, `targetType`
- **Logic:** Toggle bookmark state via store.

### 3.3 View: `BookmarksView.jsx`
- **Tech:** React Bootstrap (`Container`, `Row`, `Card`), `.jsx`, **JSDoc**
- **Logic:**
  - Uses `BookmarksStore` to fetch data.
  - Renders grid of bookmarked items.

### 3.4 Store: `BookmarksStore.js`
- **Tech:** MobX, `.js`, **JSDoc**
- **Logic:**
  - `fetchUserBookmarks(userId)`
  - `toggleBookmark(userId, id, type)`
  - Uses `localStorage` to get current `userId`.

---

## 4. Feature: TMDB Person Images

> **Requirement 3-D.2:** Fetch person images from TMDB using the `nconst` (IMDB ID).

### 4.1 Environment Setup
Add TMDB API key to `.env` (create if not exists):
```bash
VITE_TMDB_API_KEY=your_api_key_here
```

### 4.2 File Structure
**Location:** `src/api/`
- `tmdbService.js` (New)

**Location:** `src/features/Chris/persons/`
- `components/PersonImage.jsx` (New)

### 4.3 Service: `tmdbService.js`
- **Tech:** Vanilla JS, **JSDoc**
- **Logic:** Two-step API process per project requirements:

```javascript
/**
 * @fileoverview TMDB API service for fetching person images
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Fetches a person's profile image from TMDB using their IMDB nconst.
 * 
 * Process (per requirement 3-D.2):
 * 1. Use nconst to find TMDB ID via /find endpoint
 * 2. Use TMDB ID to fetch profile images
 * 
 * @param {string} nconst - IMDB person ID (e.g., "nm0000229" for Spielberg)
 * @returns {Promise<string|null>} Full image URL or null if not found
 */
export async function fetchTmdbPersonImage(nconst) {
  try {
    // Step 1: Convert IMDB nconst → TMDB ID
    const findUrl = `${TMDB_BASE}/find/${nconst}?external_source=imdb_id&api_key=${API_KEY}`;
    const findRes = await fetch(findUrl);
    const findData = await findRes.json();
    
    const tmdbId = findData.person_results?.[0]?.id;
    if (!tmdbId) return null; // Person not in TMDB
    
    // Step 2: Fetch person images using TMDB ID
    const imgUrl = `${TMDB_BASE}/person/${tmdbId}/images?api_key=${API_KEY}`;
    const imgRes = await fetch(imgUrl);
    const imgData = await imgRes.json();
    
    const filePath = imgData.profiles?.[0]?.file_path;
    return filePath ? `${IMAGE_BASE}${filePath}` : null;
  } catch (error) {
    console.error('TMDB fetch error:', error);
    return null;
  }
}
```

### 4.4 Component: `PersonImage.jsx`
- **Tech:** React Bootstrap (`Image`), `.jsx`, **JSDoc**
- **Props:** `nconst`, `alt`, `fallback`
- **Logic:** 
  - Calls `fetchTmdbPersonImage(nconst)` on mount
  - Shows loading state / fallback if no image

---

## 5. Feature: Real Search

> **Requirements:** 
> - 1-D.2: Search history must be stored as side effect of search
> - 3-E.5: Support searching for movies **and people**

### 5.1 File Structure
**Location:** `src/features/Tim/search/`
- `components/SearchForm.jsx` (New)
- `components/SearchResults.jsx` (New/Update)
- `store/SearchStore.js` (Update)

### 5.2 Search Types
The search must support **both movies and people** (requirement 3-E.5):

```javascript
// SearchStore.js - add search type toggle
searchType: 'movies' | 'people', // Default: 'movies'

async searchNow() {
  const endpoint = this.searchType === 'movies' 
    ? '/api/v1/titles/search' 
    : '/api/v1/persons/search';
  // ... fetch logic
}
```

### 5.3 Search History Tracking (Requirement 1-D.2)
Every search must be saved to database. Update `SearchStore`:

```javascript
/**
 * Saves search query to user's search history.
 * Called automatically after each search (requirement 1-D.2).
 * @param {string} query - The search query
 */
async saveSearchHistory(query) {
  const token = localStorage.getItem('token');
  if (!token) return; // Only for logged-in users
  
  await fetch('/api/v1/search-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });
}

async searchNow() {
  // ... existing search logic
  
  // Save to history after successful search
  await this.saveSearchHistory(this.query);
}
```

### 5.4 Backend Endpoint Needed
Ensure backend has endpoint for search history:
```
POST /api/v1/search-history
Body: { "query": "..." }
```

---

## 6. Integration & Routing (Critical)

### 6.1 Route Configuration
We must register the new Bookmarks page in the router.
1.  **Create Route File:** `src/routes/bookmarks.tsx` (This can be TS or JS, sticking to TS for consistency with other route files is fine, or JS if strictly preferred).
2.  **Update Tree:** Add `bookmarksRoute` to `src/routeTree.tsx` under `appLayoutRoute`.

### 6.2 Navigation
Update `src/features/Chris/navbar/components/Navbar.tsx`:
- Add `<NavLink to="/bookmarks">Bookmarks</NavLink>` to the `DesktopLinks` section.

### 6.3 UI Integration
- **Add RatingControl:** Insert `<RatingControl />` into `MovieDetailsView.tsx`.
- **Add BookmarkButton:** Insert `<BookmarkButton />` into `MovieCard.tsx`, `MovieDetailsView.tsx`, and `PersonCard.tsx`.
- **Add PersonImage:** Insert `<PersonImage />` into `PersonCard.tsx` and `PersonDetailsView.tsx`.

---

## Summary of New Files (Aligned Structure)

| Feature | Type | File Path |
| :--- | :--- | :--- |
| **Config** | Env | `.env` (add `VITE_TMDB_API_KEY`) |
| **Styling** | Style | `src/styles/overrides.css` |
| **API** | Service | `src/api/tmdbService.js` |
| **Rating** | Component | `src/features/Chris/movies/components/RatingControl.jsx` |
| **Rating** | Store | `src/features/Chris/movies/store/RatingStore.js` |
| **Bookmarks** | Component | `src/features/Chris/bookmarks/components/BookmarkButton.jsx` |
| **Bookmarks** | View | `src/features/Chris/bookmarks/views/BookmarksView.jsx` |
| **Bookmarks** | Store | `src/features/Chris/bookmarks/store/BookmarksStore.js` |
| **Images** | Component | `src/features/Chris/persons/components/PersonImage.jsx` |
| **Search** | Component | `src/features/Tim/search/components/SearchForm.jsx` |
| **Search** | Component | `src/features/Tim/search/components/SearchResults.jsx` |
| **Search** | Store | `src/features/Tim/search/store/SearchStore.js` (Update) |
| **Route** | Logic | `src/routes/bookmarks.tsx` |


## Next Steps
1. Get approval on DB changes.
2. Install Bootstrap.
3. Setup Routing (`src/routes/bookmarks.tsx` & `routeTree.tsx`).
4. Build `tmdbService.js` & `PersonImage.jsx`.
5. Build Bookmarks Feature (Store -> View -> Component -> Integration).
6. Build Rating Feature (Store -> Component -> Integration).
7. Build Real Search.
