# Strict Implementation Ruleset

This document serves as the **SINGLE SOURCE OF TRUTH** for how new features must be implemented. Any deviation from these rules requires explicit user approval.

## 1. Language & Type Safety
*   **New Files:** MUST be **JavaScript** (`.jsx` for components, `.js` for logic/stores).
    *   *Reason:* To satisfy project requirement "implement part of the frontend in TypeScript" (by ensuring the *rest* is JS).
*   **Existing Files:** Do NOT convert existing `.ts`/`.tsx` files to JS. Keep them as is.
*   **Documentation:** All JavaScript files MUST use **JSDoc** for type documentation.
    *   *Example:*
        ```javascript
        /**
         * @param {string} userId
         * @returns {Promise<void>}
         */
        ```

## 2. User Interface & Styling
*   **Primary Framework:** MUST use **React Bootstrap** components.
    *   *Import:* `import { Button, Card, Container } from 'react-bootstrap';`
*   **Constraint:** Do NOT use Tailwind classes for layout in *new* files. Use Bootstrap Grid (`Container`, `Row`, `Col`).
*   **Custom CSS:** Only allowed in `src/styles/overrides.css` for small tweaks. Do NOT use `styled-components` in new files.

## 3. Data & API Handling
*   **Database:** Do **NOT** execute SQL commands or modify the database schema at this stage.
*   **Mocking:** All new Stores (`RatingStore.js`, `BookmarksStore.js`) MUST mock backend calls initially.
    *   *Mechanism:* Use `setTimeout` to simulate network delay and return fake success responses.
    *   *Goal:* UI must be fully clickable and interactive without a working backend.
*   **TMDB:** Only read-only requests to external TMDB API are allowed (for images).

## 4. Architecture & File Structure
*   **Pattern:** Follow the existing Feature-based architecture:
    *   `src/features/[FeatureName]/components/`
    *   `src/features/[FeatureName]/views/`
    *   `src/features/[FeatureName]/store/`
*   **State Management:** Use **MobX** for all new stores.
    *   Stores must be plain JS classes.
    *   Use `makeAutoObservable` in constructor.

## 5. Verification Process
Before declaring a task "Done", the following must be true:
1.  **Linting:** `npm run lint` passes without errors in the new file.
2.  **Build:** `npm run build` passes (ensures JS/TS interop works).
3.  **Visual:** The component renders in the browser (verified via screenshot or user confirmation).
