# Frontend Implementation Plan

Baseret på `project-description.txt` - Subproject 3: The Frontend

---

## ✅ Hvad er LAVET

### 3-E.1 Single-Page Application
- [x] React SPA med TanStack Router
- [x] Vite build system

### 3-E.2 Navigation Bar
- [x] Navigation komponent med links
- [x] Home, Movies, Styled Demo links
- [x] Active state highlighting

### 3-E.3 Pagination
- [x] Movie list med pagination (Next/Previous)
- [x] Page nummer display (Page X of Y)

### 3-B Presentation Layer (Delvist)
- [x] React komponenter med TypeScript
- [x] MobX state management
- [x] Styled-components til styling
- [x] Movie List og Details pages

### 3-D Data Access Layer (Delvist)
- [x] MobX stores til data håndtering
- [x] Async data fetching pattern
- [x] Mock data struktur klar til API

---

## ❌ Hvad MANGLER

### 3-A User Interface Design (Dokumentation)
- [ ] 3-A.1 Site structure diagram
- [ ] 3-A.2 Wireframe models for alle pages
- [ ] 3-A.3 Route dokumentation

### 3-B Presentation Layer
- [ ] 3-B.1 Dokumenter React komponenter og hierarki
- [ ] 3-B.2 Dokumenter React patterns (hooks, router, etc.)
- [ ] 3-B.3 Dokumenter third-party libraries
- [ ] 3-B.4 Bootstrap integration (kræves af project description!)

### 3-C Business Logic Layer
- [ ] 3-C.1 Dokumenter intern data repræsentation
- [ ] 3-C.2 Dokumenter helper functions

### 3-D Data Access Layer
- [ ] 3-D.1 Dokumenter data access implementation
- [ ] 3-D.2 **TMDB billeder af personer** (PÅKRÆVET!)
  - Hent person billeder fra TMDB API
  - Brug nconst til at finde person i TMDB
  - Vis billeder i frontend

### 3-E Functional Requirements
- [ ] 3-E.4 **Framework features** (PÅKRÆVET!)
  - [ ] User registration
  - [ ] User login
  - [ ] Bookmarking af titles
  - [ ] Bookmarking af people
- [ ] 3-E.5 **Søgning og rating** (PÅKRÆVET!)
  - [x] Søgning (mock data i SearchStore)
  - [ ] Søgning mod rigtig backend API
  - [ ] Movie/title rating
  - [ ] Search history tracking
  - [ ] Visning af actors/personer

### 3-F Non-functional Requirements
- [ ] 3-F.1 Bootstrap integration (project kræver det!)
- [x] 3-F.2 Modular, scalable, maintainable struktur

### 3-G Individual Reflections
- [ ] 3-G.1 Individuelle refleksioner (2 sider per gruppemedlem)

---

## 🔴 KRITISKE MANGLER (Skal laves!)

### 1. Backend Integration
```
Status: Mock data → Skal kobles til rigtig API
Endpoints: http://localhost:5175/api/v1/...
```

### 2. User Authentication
```
- Login side
- Register side
- JWT token håndtering
- Protected routes
```

### 3. TMDB Person Images
```
- API integration med TMDB
- Hent person billeder via nconst
- Vis i actor/person komponenter
```

### 4. Bookmarking Feature
```
- Bookmark button på movies
- Bookmark button på actors
- Bookmarks liste side
```

### 5. Rating Feature
```
- Rate movies (1-10 skala)
- Vis nuværende rating
- Opdater rating i backend
```

### 6. Search History
```
- Track søgninger
- Vis søgehistorik for bruger
```

### 7. Actors/People Pages
```
- Actor list page
- Actor details page
- Co-players visning
- Actor rating display
```

---

## 📋 Prioriteret Todo Liste

### Phase 1: Backend Integration (Højeste prioritet)
1. [ ] Opdater MovieStore til at bruge rigtig API
2. [ ] Opdater MovieDetailsStore til at bruge rigtig API
3. [ ] Opdater SearchStore til at bruge rigtig API

### Phase 2: Authentication
4. [ ] Login page
5. [ ] Register page
6. [ ] Auth store med JWT
7. [ ] Protected routes

### Phase 3: Framework Features
8. [ ] Bookmark komponent
9. [ ] Bookmarks page
10. [ ] Rating komponent
11. [ ] Search history visning

### Phase 4: People/Actors
12. [ ] Actor list page
13. [ ] Actor details page
14. [ ] TMDB image integration

### Phase 5: Dokumentation
15. [ ] Site structure diagram
16. [ ] Wireframes
17. [ ] Component dokumentation
18. [ ] API dokumentation

---

## 📊 Status Oversigt

| Kategori | Lavet | Mangler | Prioritet |
|----------|-------|---------|-----------|
| Navigation | ✅ | - | Done |
| Movie List | ✅ | API | Høj |
| Movie Details | ✅ | API | Høj |
| Search | ✅ Mock | API | Høj |
| Pagination | ✅ | - | Done |
| Auth | ❌ | Alt | Kritisk |
| Bookmarks | ❌ | Alt | Kritisk |
| Ratings | ❌ | Alt | Kritisk |
| Actors/People | ❌ | Alt | Høj |
| TMDB Images | ❌ | Alt | Høj |
| Dokumentation | ❌ | Alt | Medium |

---

## ⚠️ Noter

1. **Bootstrap krav**: Project description kræver React Bootstrap (3-B.4, 3-F.1). I bruger pt. styled-components - overvej om I vil skifte eller kombinere.

2. **TypeScript**: I bruger TypeScript (tilladt per 3-F.1), husk at dokumentere fordele/ulemper.

3. **nconst værdier**: Backend skal returnere nconst for personer, så frontend kan hente TMDB billeder (3-D.2).

4. **HATEOAS**: Backend API skal returnere self-links i responses (2-C.5) - check at frontend håndterer dette.
