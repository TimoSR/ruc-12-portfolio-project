# Missing Implementation Details & Known Issues

## Database Schema
### Missing Foreign Key Constraint
*   **Table:** `movie_db.user_rating`
*   **Column:** `account_id`
*   **Target:** `profile.account(id)`
*   **Issue:** The `account_id` column in the `user_rating` table does not formally reference the `account` table in the `profile` schema.
*   **Reason:** The `movie_db` schema is created before the `profile` schema in the initialization scripts (`2_moviedb_framework.sql` runs before `3_profile_framework.sql`). A foreign key cannot reference a table that doesn't exist yet.

### Missing Rating Aggregation Update
*   **Table:** `movie_db.rating`
*   **Issue:** The aggregate rating (average rating and vote count) is not updated when a user adds a rating through the backend application.
*   **Reason:** The backend `RatingService` uses Entity Framework to insert directly into the `movie_db.user_rating` table. It does *not* call the `api.add_user_title_rating` SQL function, which is designed to handle both the insertion and the recalculation of the aggregate `movie_db.rating`. There are no database triggers on `movie_db.user_rating` to automatically update the aggregates.
*   **Consequence:** The `average_rating` and `num_votes` columns in `movie_db.rating` will become out of sync with the actual data in `movie_db.user_rating`.

## Backend Implementation
### Search Optimization Discrepancy
*   **Issue:** The backend re-implements SQL search logic (JOINs and `ILIKE` filters) directly in the C# code instead of calling the optimized `api` schema functions.
*   **Impacted Functions:** `TitleRepository.SearchAsync` and `TitleRepository.StructuredSearchAsync`.
*   **Reason:** The implementation uses EF LINQ or inline SQL strings, bypassing the database-level functions like `api.string_search_title`.
*   **Consequence:** Increased code duplication and maintenance risk. Database index optimizations (like Trigram and Full-text) may not be fully utilized as originally designed in the `api` schema.

### Security: Plain Text Passwords
*   **Issue:** User passwords are stored and compared as plain text in the authentication flow.
*   **Affected Service:** `AccountService.LoginAsync` and `AccountService.CreateAccountAsync`.
*   **Status:** Acknowledged in code comments as insecure ("WARNING: Plain text password...").
*   **Consequence:** Severe security risk; anyone with database access can see user passwords.
