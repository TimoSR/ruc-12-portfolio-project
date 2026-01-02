# Feature Implementation Plan v3: Final Polish & Backend Integration

**Status:** `DRAFT`
**Goal:** Complete the remaining features from v2, specifically moving from **MOCKED** data to **REAL** backend integration for User Profile features, and verifying TMDB integration.

## 1. Situation Analysis
You are correct; while `feature_implementation_planv2.md` outlined the steps, several features were left in a "Mocked" or "Partial" state on the frontend without corresponding Backend support.

| Feature | Current State | Missing Component |
| :--- | :--- | :--- |
| **Bookmarks** | ⚠️ **Frontend Mocked** | **Backend Missing:** No DB table, no API endpoints. Frontend stores data in memory/local state only. |
| **Search History**| ⚠️ **Frontend Mocked** | **Backend Missing:** No DB table, no API endpoints. |
| **Ratings** | ⚠️ **Frontend Mocked** | **Backend Partial:** Controller exists, but frontend `RatingStore` uses timeouts/fake data instead of calling API. |
| **User Profile** | ❌ **Missing** | **View Missing:** No page exists to display the history/bookmarks/ratings. |
| **TMDB Images** | ❔ **Unverified** | Code exists (`PersonImage.jsx`), needs visual verification that API key works and images load. |

---

## 2. Implementation Steps

### Phase 1: Backend Implementation (C#)
*Goal: Create the missing persistence layer.*

1.  **Database & Domain**:
    -   Create `Bookmark` and `SearchHistory` entities.
    -   Update `DbContext` and add migrations.
2.  **API Controllers**:
    -   Create `BookmarksController` (`GET`, `POST`, `DELETE`).
    -   Create `SearchHistoryController` (`GET`, `POST`).
    -   *Constraint*: Follow existing clean architecture (Domain -> Application -> Infrastructure -> API).

### Phase 2: Frontend Integration (JS/MobX)
*Goal: Connect frontend to the new backend endpoints.*

1.  **Remove Mocks**:
    -   Update `BookmarksStore.js` to fetch/post to `/api/v1/bookmarks`.
    -   Update `RatingStore.js` to fetch/post to `/api/v1/accounts/.../ratings`.
    -   Update `SearchStore.js` to post to `/api/v1/search-history`.
2.  **Create User Profile View**:
    -   Create `src/features/Chris/auth/views/UserProfileView.jsx`.
    -   **UI**: Use React Bootstrap Tabs to show:
        -   **Overview**: Summary stats (e.g. "50 searches", "12 bookmarks").
        -   **History**: List of recent searches.
        -   **Bookmarks**: Grid of bookmarked Movies and People.
        -   **Ratings**: List of rated items.

### Phase 3: TMDB & Final Verification
1.  **Visual Check**: Verify `PersonImage` loads real photos on Person Details page.
2.  **Flow Check**:
    -   Search "Matrix" -> Check History.
    -   Bookmark "Matrix" -> Check Profile/Bookmarks.
    -   Rate "Matrix" -> Check Profile/Ratings.

---

## 3. Rules & Constraints
-   **Frontend**: JS + JSDoc + React Bootstrap (No Tailwind).
-   **Backend**: C# .NET.
-   **Files**: Create new files in correct feature folders (`features/Chris/...`).

## 4. Execution Order
1.  **Backend**: Fix Database & Controllers.
2.  **Frontend**: Update Stores.
3.  **Frontend**: Build Profile View.
4.  **Verify**: TMDB & User Flows.
