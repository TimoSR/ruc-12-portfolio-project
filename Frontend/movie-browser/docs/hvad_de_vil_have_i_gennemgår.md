# Hvad de vil have I gennemgår (Opdateret)

Dette dokument er opdateret baseret på en nøje gennemgang af `project-description.txt` for at sikre, at jeres præsentation matcher de formelle læringsmål.

## 1. De 3 Nøglekriterier (Fra Underviser)
I skal vælge emner der er:
1.  **Interesting:** Viser forståelse for kravene (f.eks. Usability, Arkitektur).
2.  **Difficult:** Viser teknisk dybde (f.eks. Asynkronitet, Data-modellering).
3.  **Clever:** Viser overskud (f.eks. Performance optimering, Genbrug).

## 2. Emner matchet mod Project Description

Her er jeres "talking points" mappet direkte til kravene i `project-description.txt`. Brug disse referencer til at vise, at I har læst opgaven!

### Timo: Frontend Arkitektur & Usability
*Opfylder: Section 3-A (Design), 3-C (Business Logic)*

1.  **Arkitektur & MobX (Clever/Interesting)**
    *   **Ref:** *Section 3-C: "Business Logic Layer containing any logic independent of the presentation layer".*
    *   **Argument:** Vi har ikke bare lagt logik i React components. Vi har separeret det i **Stores** (MobX). Dette opfylder kravet om "decoupled components" og separeret ansvar (Architecture).
    *   **Feature-folders:** "Colocation" gør koden vedligeholdelsesvenlig (Maintainability).

2.  **Live Search & Debouncing (Difficult)**
    *   **Ref:** *Section 3-E: "Functional requirements".*
    *   **Argument:** En "Live Search" er en forbedring af basis-kravet.
    *   **Udfordringen:** At undgå "race conditions" og overbelastning.
    *   **Løsningen:** Debounce i `SearchStore`. Det viser teknisk forståelse for asynkron JavaScript.

3.  **Usability Heuristics (Interesting)**
    *   **Ref:** *Section 3-A: "Complies with Jacob Nielsen’s 10 Usability Heuristics".*
    *   **Eksempel:** "Visibility of System Status" -> Vi viser loading spinners i søgefeltet. "Error Prevention" -> Vi disabler knapper når data loader. Nævn dette specifikt!

### Chris: Data Relations & Functionality
*Opfylder: Section 1-C (Framework), 1-D (Advanced Functions), 2-D (Security)*

1.  **Complex Data Integration (Difficult)**
    *   **Ref:** *Section 1-D.6 (Co-players) & 1-D.9 (Similar movies).*
    *   **Argument:** Vi viser ikke bare flad data. Vi har implementeret de komplekse relationer.
    *   **Vis det:** Vis `CoPlayers` komponenten. Fortæl hvordan backendens SQL view eller stored procedure er bundet sammen med frontendens visning.

2.  **Authentication & Security (Difficult)**
    *   **Ref:** *Section 2-D: "Security... backend must have the capability to manage users".*
    *   **Argument:** Vi har implementeret JWT (Option iii i opgaven).
    *   **Detalje:** Forklar hvordan vi sikrer at "restricted" komponenter (som Bookmarks) kun vises når man er logget ind.

3.  **Bookmarks & Polymorphism (Clever)**
    *   **Ref:** *Section 1-C: "Framework Model... bookmarking of titles and names".*
    *   **Smart:** Backendens model håndterer både film og personer. Frontendens `BookmarkButton` er en genbrugelig komponent der virker på tværs af entiteter. Det er "Clever" genbrug.

## 3. Demo Tjekliste (Realitetstjek)

Baseret på koden og kravene, skal demoen vise følgende flow for at bestå "Functionality":

1.  **Søgning (Section 1-D.2):** Vis at "Live Search" finder både film og personer.
2.  **Kompleks Visning:** Gå ind på en skuespiller -> Se "Known For" -> Klik på en film. (Viser at I kan navigere i grafen).
3.  **Auth Flow:**
    *   Registrer en bruger (Viser *Write* til databasen).
    *   Log ind (Viser *Read* og validering).
4.  **Framework Features (Section 1-C):**
    *   Lav et Bookmark på filmen.
    *   (Hvis det virker): Giv en Rating.
    *   Gå til "My Profile" og se at det er gemt.

**Vigtigt:** Hvis "Rate" knappen (`RatingControl.jsx`) kun er UI og ikke gemmer i databasen, så *spring det over* i demoen. Vis i stedet Bookmarks, som vi ved virker.

## 4. Q&A Forberedelse
Vær klar på at svare på:
*   "Hvordan har I sikret jer mod SQL injection?" (Entity Framework / Parameterized queries).
*   "Hvorfor valgte I MobX?" (Testbarhed, separation of concerns).
*   "Hvordan håndterer I billeder?" (TMDB integrationen, som nævnt i Section 3 intro).
