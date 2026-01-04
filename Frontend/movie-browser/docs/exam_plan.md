# Exam Presentation Plan: Movie Browser Project

This plan outlines the strategy for the group exam based on the project requirements (`project-description.txt`), the specific exam format (Personal Presentation + Group Demo), and the submitted documentation.

> **Note on Sources**:
> *   **Frontend details** are based on *Chapter 4* of `movie_browser_report.txt` (Subproject 3).
> *   **Database/Backend details** are conceptually based on `portproject1.txt` and `portproject2.txt` (Subproject 1 & 2).
> *   **Requirements** references (e.g., "Section 3-C") refer to `project-description.txt`.

## 1. Context & Strategy

-   **Situation**: The `main` branch was the submitted version. The `feature/bootstrap-js-implementation` branch contains the final touches.
-   **Strategy**:
    -   **Presentation**: Each member presents a topic labeled **"Interesting"**, **"Difficult"**, or **"Clever"**, as per the exam guidelines.
    -   **Demo**: A 3-5 minute guided tour showing the system works as a whole.

---

## 2. Individual Presentations (5 min each)

### Timo: Frontend Architecture & Search Experience
*Focus: Architecture (Clever) & Async Logic (Difficult).*
*Source Material: Report Chapter 4 (Frontend).*

**Map to Requirements:**
*   *Section 3-C (Business Logic)*: "Internal representation of data... functions to help maintain these representations".
*   *Section 3-E (Functional Reqs)*: "Search functionality".

1.  **Architecture (1.5 min) - *The "Clever" Aspect***:
    -   **Feature-Based Folder Structure**: Moving away from technical layers (controllers/views) to Features (`/movies`, `/search`).
        -   *Why*: "Colocation" improves maintainability. Refers to **Report 4.6.2 (Code Quality)**.
    -   **State Management (MobX)**:
        -   *Why*: Decouples **Business Logic** (Stores) from **UI** (Components), satisfying **Requirement 3-C**.
        -   *Detail*: "Stores act as the single source of truth" (**Report 4.3.1**).

2.  **Deep Dive: The Search Feature (2.5 min) - *The "Difficult" Aspect***:
    -   **The Challenge**: Implementing "Live Search" without overloading the API.
    -   **The Solution**: **Debounce Pattern** in `SearchStore` (**Report 4.3.1**).
    -   **Walkthrough**:
        -   User types -> Timer starts (300ms) -> API call only on silence.
        -   *Visual*: Show the loading spinner logic (`isLoading`), complying with "Visibility of System Status" (**Requirement 3-A** / **Report 4.1.4**).

3.  **UI Verification (1 min)**:
    -   **Ref**: **Requirement 3-A** (Usability).
    -   **Point**: We followed Jakob Nielsen’s heuristics (e.g., "Match between system and real world" by using terms like "Movies" instead of "Title").

### Chris: Data Integration & Personalization
*Focus: Complex Data (Difficult) & Security/Context (Interesting).*
*Source Material: Frontend Report (Integration) + Requirements.*

**Map to Requirements:**
*   *Section 1-D (Functionality)*: "Co-players" & "Similar Movies".
*   *Section 1-C (Framework)*: "Bookmarking".
*   *Section 2-D (Security)*: "Manage users... JWT".

1.  **Orchestrating Complex Data (2 min) - *The "Difficult" Aspect***:
    -   **The Domain**: Our data involves strict separation of "Static Metadata" (Movies) and "User Data" (Profile).
    -   **Frontend Integration**: How `PersonDetailsView` bridges this by fetching separate resources:
        -   *Person Metadata* (from MovieDB schema).
        -   *Known For / Co-Players* (Calculated relations).
        -   *Images* (External TMDB integration, **Requirement 3-D.2**).
    -   *Point*: The Frontend acts as the aggregator, keeping the backend services pure.

2.  **Authentication & User Context (1.5 min) - *The "Interesting" Aspect***:
    -   **Auth Flow**: Using **JWT** (JSON Web Tokens) for stateless authentication (**Requirement 2-D**).
    -   **Frontend Implementation**:
        -   `AuthStore` manages the token lifecycle.
        -   Stored in `localStorage` -> Injected into API headers via `apiClient` (**Report 4.4.1**).
        -   *Result*: Seamless "My Profile" experience without server-side sessions.

3.  **Use Case: Bookmarks (1.5 min) - *The "Clever" Aspect***:
    -   **Concept**: A **Unified Bookmark System** (Polymorphic design).
        -   *Ref*: **Requirement 1-C** ("Bookmarking of titles and names") & **Report 4.5.4**.
    -   **Execution**:
        -   One button component (`BookmarkButton`) handles both "Movie" and "Person" types.
        -   Shows how generic backend design ("target_type" enum) simplifies frontend logic.

---

## 3. Group Demo (3-5 min)

**Driver**: [Decide who controls the mouse]
**Goal**: Show the flow described in the report.

1.  **Start at Home Page**:
    -   "This is our Single Page Application (**Req 3-E.1**)."

2.  **The Search (Timo's Feature)**:
    -   Type "Inception" slowly. Show the **Debounce** spinner (proven code from Report).
    -   Click a result.

3.  **Movie Details (Chris's Feature)**:
    -   Scroll down. "Here we see the aggregation of data: Plot, Rating, and Actors."

4.  **Person & Relationships**:
    -   Click on an Actor. Point out "Known For" and "Co-Players".
    -   "This data comes from our normalized database structure."

5.  **Authentication & Personalization**:
    -   Click "Login". Log in (show state change in Navbar).
    -   Go back to a movie -> Click **Bookmark**.
    -   Go to **My Profile** -> Show the bookmark appears. "This verifies the full stack integration."

6.  **Wrap up**:
    -   "That concludes the demo of the fully implemented solution."

---

## 4. Prep Checklist

- [ ] **Verify `feature` branch builds**: Ensure `npm run dev` works.
- [ ] **Data Check**: Ensure `cit12-portfolio-1.txt` (Test Output) is available if asked for proof of DB testing.
- [ ] **Test User**: Have valid credentials ready.
- [ ] **Talking Points**: Each member practices their 5-minute block.
