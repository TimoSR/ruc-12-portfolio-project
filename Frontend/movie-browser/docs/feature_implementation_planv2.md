# Feature Implementation Plan v2: Remaining JS & Bootstrap Features

This document outlines the current status and the remaining steps to complete the frontend features using **JavaScript (JSDoc)** and **React Bootstrap**.

## 1. Current Status Overview

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Unified Search** | ✅ **DONE** | Search bar works, dropdown works, results styling fixed. |
| **Search History** | 🔄 **PARTIAL** | Logic exists in `SearchStore`, needs verification of backend persistence. |
| **Bookmarks** | 🔄 **PARTIAL** | Directory structure exists (`Chris/bookmarks`). Need to verify `BookmarkButton` integration. |
| **Ratings** | 🔄 **PARTIAL** | `RatingStore.js` exists. Need to integrate `RatingControl` into views. |
| **Person Images** | 🔄 **PARTIAL** | `tmdbService.js` exists. Need to integrate `PersonImage` into views. |
| **User Profile** | ❌ **TODO** | Need a view to show Search History and Ratings. |
| **Similar/Co-Players** | ❌ **TODO** | Advanced visualization components need to be created. |

---

## 2. Detailed Remaining Tasks

### 2.1 Feature: Ratings (Integration)
**Goal:** Allow users to rate titles (1-10 stars).

- [ ] **Verify `RatingControl.jsx`**: Ensure it exists in `src/features/Chris/movies/components/`.
- [ ] **Integration**: Add `<RatingControl />` to `MovieDetailsView.tsx`.
- [ ] **Logic Check**: Verify `RatingStore.js` correctly calls the backend API.

### 2.2 Feature: Bookmarks (Integration)
**Goal:** Allow users to bookmark Movies and People.

- [ ] **Verify `BookmarkButton.jsx`**: Ensure it exists in `src/features/Chris/bookmarks/components/`.
- [ ] **Integration 1 (Movies)**: Add to `MovieCard.tsx` and `MovieDetailsView.tsx`.
- [ ] **Integration 2 (People)**: Add to `PersonCard.tsx` and `PersonDetailsView.tsx`.
- [ ] **Bookmarks Page**: Verify `BookmarksView.jsx` works and is routed correctly `/bookmarks`.

### 2.3 Feature: Person Images (TMDB Integration)
**Goal:** Show real photos of actors from TMDB.

- [ ] **Verify `PersonImage.jsx`**: Ensure it exists in `src/features/Chris/persons/components/`.
- [ ] **Integration**: Replace placeholder images in `PersonCard.tsx` and `PersonDetailsView.tsx` with `<PersonImage nconst={...} />`.
- [ ] **Env Var**: Ensure `VITE_TMDB_API_KEY` is set in `.env`.

### 2.4 Feature: User Profile (Visualization)
**Goal:** Visualize user data (History & Ratings) per Requirement 1-D.

- [ ] **Create Component**: `src/features/Chris/auth/views/UserProfileView.jsx`
- [ ] **Logic**:
    - Fetch Search History from backend.
    - Fetch User Ratings from backend.
    - Render 2 lists/tables (Bootstrap styled).
- [ ] **Route**: Add `/profile` route.

### 2.5 Feature: Advanced Visualizations
**Goal:** "Co-players" and "Similar Movies" (Requirements 1-D.6, 1-D.9).

- [ ] **Similar Movies**: Create `src/features/Chris/movies/components/SimilarMovies.jsx`.
    - Fetch similar movies for a given `tconst`.
    - Display as a horizontal scroll or grid.
- [ ] **Co-Players**: Create `src/features/Chris/persons/components/CoPlayers.jsx`.
    - Fetch frequent co-actors for a given `nconst`.
    - Display list with small images.

---

## 3. Implementation Steps (Next 3 Actions)

1.  **Integrate Visuals (Images & Buttons):**
    - Add `PersonImage`, `BookmarkButton`, and `RatingControl` to their respective views. This makes the UI feel "complete".
    
2.  **Build User Profile:**
    - Create the profile page to visualize the history and data we are collecting.

3.  **Advanced Features:**
    - Tackle the complex API calls for Similar Movies/Co-players last.

---

## 4. Technical Constraints Reminder
- **Language**: New files must be **JavaScript (`.jsx`/`.js`)**.
- **Documentation**: All JS files must use **JSDoc**.
- **Styling**: **React Bootstrap** only (plus `overrides.css`).
