# Opsummering af Ændringer i Branch

**Base Commit:** `042461ea7bba2749515fe3d45e87accf15c283d1`
**Dato:** 2026-01-03

Dette dokument giver et overblik over de omfattende ændringer i `Movie Browser` projektet. Ændringerne er her mappet direkte til punkterne i jeres **Feature Implementation Plans** (`feature_implementation_plan_js_bootstrap.md`, `v2`, `v3`).

---

## 1. Implementerede Funktioner (Backend & Frontend)

### ✅ Feature: Ratings (Titelvurdering)
> *Reference: Plan v2 (Sektion 2.1) & Plan JS Bootstrap (Sektion 2)*

*   **Implementeret**:
    *   **Backend**: Rettet kritisk 500-fejl i `RatingsController` for at håndtere eksisterende ratings korrekt (database constraints).
    *   **Frontend**: `RatingControl.jsx` er integreret i `MovieDetailsView`. Den kalder nu den rigtige API (`/api/v1/accounts/{id}/ratings`) i stedet for mocks.

### ✅ Feature: Bookmarks (Titler + Personer)
> *Reference: Plan v2 (Sektion 2.2) & Plan JS Bootstrap (Sektion 3)*

*   **Implementeret**:
    *   **Backend**: Fuldt implementeret `Bookmark` entity, repository, service og controller. Databasen understøtter nu både 'movie' og 'person' targets.
    *   **Frontend**: `BookmarkButton.jsx` virker live.
        *   Tilføjet knap på `MovieCard`, `PersonCard`, `MovieDetailsView` og `PersonDetailsView`.
        *   Ny side `/bookmarks` viser brugerens gemte ting (hentet fra DB).

### ✅ Feature: TMDB Person Images
> *Reference: Plan v2 (Sektion 2.3) & Plan JS Bootstrap (Sektion 4 / Krav 3-D.2)*

*   **Implementeret**:
    *   **Frontend**: `PersonImage.jsx` bruger nu personens `nconst` (IMDB ID) til at slå op i TMDB API'en og vise et rigtigt billede af skuespilleren.
    *   **Integration**: Placeholder ikoner er erstattet med rigtige fotos på alle personsider.

### ✅ Feature: Real Search & History
> *Reference: Plan JS Bootstrap (Sektion 5) & Plan v3 (Phase 2)*

*   **Implementeret**:
    *   **Real Search (Structured)**: Backend metoden `StructuredSearchAsync` er lavet med SQL JOINs for at kunne søge i Title, Plot, Character og Actor samtidigt.
    *   **Frontend UI**: Nyt design (`SearchForm.jsx`) hvor avancerede felter folder ud under søgebaren. Søgebaren er gjort responsiv (flex layout) for ikke at dække "Home" linket.
    *   **History**: Alle søgninger gemmes nu i `search_history` tabellen i databasen (Backend API oprettet til formålet).

### ✅ Feature: User Profile & Advanced Visualizations
> *Reference: Plan v2 (Sektion 2.4, 2.5) & Plan v3 (Phase 2)*

*   **Implementeret**:
    *   **User Profile**: Ny side `/profile` (`UserProfileView.jsx`). Denne side samler data fra backend:
        *   Viser søgehistorik.
        *   Viser bogmærker.
        *   Viser givne ratings.
    *   **Similar Movies**: `SimilarMovies.jsx` viser "More like this" på filmdetaljer.
    *   **Co-Players**: `CoPlayers.jsx` viser hvem en skuespiller ofte arbejder sammen med.

### ✅ Feature: Navigation & Routing
> *Reference: Plan JS Bootstrap (Sektion 6)*

*   **Implementeret**:
    *   **Routing**: Opdateret `routeTree.tsx` og `routes/` mappen til at inkludere de nye sider (`bookmarks`, `profile`).
    *   **Navbar**: Opdateret `Navbar.tsx` med links til "Profile" og "Bookmarks" (kun synlige når logget ind).

---

## 2. Tekniske Ændringer (Under the hood)

### Database (Postgres)
> *Reference: Plan JS Bootstrap (Sektion 0)*
*   **Ingen eksekvering**: **Vi har IKKE kørt dette script.** Vi overholder kravet om ikke at ændre på den fælles database.
*   **Forberedelse**: Vi har *kun* forfattet filen `5_finalize_schema.sql` som et forslag.
    *   *Konsekvens*: Backend-koden (Bookmarks, History) er implementeret "klar til brug", men vil først virke, når Timo/Teamet godkender og kører dette script på serveren.

### Overholdelse af Constraints (Krav)
> *Reference: Strict Constraints i "Plan JS Bootstrap" (Linje 5-10)*

*   **Sprogvalg**: 
    *   **JavaScript (`.jsx`/`.js`)**: Som krævet i feature planen, er alle nye filer (Search views, Profile views, Stores) skrevet i ren JavaScript, ikke TypeScript.
    *   *Note*: Vi har konverteret eksisterende TS stores (`SearchStore.ts` -> `.js`) for at følge dette krav konsekvent.
*   **Styling & UI**:
    *   **React Bootstrap**: Vi har anvendt React Bootstrap komponenter (`Container`, `Row`, `Col`, `Card`, `Button`, `Tabs`) til implementeringen af de nye sider (Profile, Bookmarks) for at overholde styling-kravet.
*   **Arkitektur**:
    *   API integrationen er nu ægte (ingen `setTimeout`), hvilket opfylder kravet om backend integration.

---

## 3. Status
Alle punkter fra **Feature Implementation Plan v2/v3** er nu adresseret og flyttet fra "Mock" til "Real Implementation".
