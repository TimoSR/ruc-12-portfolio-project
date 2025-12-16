# Component Creation Guide

This guide outlines the standard procedure for creating new feature components in the `movie-browser` project, based on the `demoResearch` reference implementation.

## 1. Directory Structure

All new features should be placed in `src/features/`. Each feature folder should follow this structure:

```text
src/features/[featureName]/
├── components/         # Reusable UI components specific to this feature
│   └── [ComponentName].tsx
├── store/              # MobX stores for state management
│   └── [Feature]Store.ts
├── views/              # Main view containers (smart components)
│   └── [ViewName].tsx
└── index.ts            # Public API exports
```

## 2. State Management (MobX)

We use MobX for state management. Stores should be classes that implement an interface.

### Template: `store/[Feature]Store.ts`

```typescript
import { makeAutoObservable, runInAction } from 'mobx'

export interface I[Feature]Store {
    // Define public state and methods
    isLoading: boolean
    data: string[]
    fetchData(): Promise<void>
}

export class [Feature]Store implements I[Feature]Store {
    
    isLoading: boolean = false
    data: string[] = []

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async fetchData(): Promise<void> {
        this.isLoading = true
        try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            runInAction(() => {
                this.data = ['Item 1', 'Item 2']
                this.isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                this.isLoading = false
            })
            console.error(error)
        }
    }
}
```

## 3. View Components

Views are "smart" components that instantiate the store and pass it down to children. They should be wrapped in `observer`.

### Template: `views/[ViewName].tsx`

```typescript
import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { type I[Feature]Store, [Feature]Store } from '../store/[Feature]Store'
// Import child components...

export const [ViewName] = observer([ViewName]Base)

type [ViewName]Props = {
    className?: string
}

function [ViewName]Base({ className = '' }: [ViewName]Props) {
    // Instantiate store locally for this view
    const store = useLocalObservable<I[Feature]Store>(() => new [Feature]Store())

    return (
        <Container className={className}>
            <Title>Feature Title</Title>
            {/* Pass store to child components */}
            {/* <ChildComponent store={store} /> */}
        </Container>
    )
}

// === Styled Components ===

const Container = styled.section`
    display: flex;
    flex-direction: column;
    padding: 1rem;
`

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
`
```

## 4. UI Components

UI components should be "dumb" or "presentational" where possible, but can be `observer` if they need to react to store changes directly.

### Template: `components/[ComponentName].tsx`

```typescript
import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { I[Feature]Store } from '../store/[Feature]Store'

export const [ComponentName] = observer([ComponentName]Base)

type [ComponentName]Props = {
    store: I[Feature]Store
    className?: string
}

function [ComponentName]Base({ store, className = '' }: [ComponentName]Props) {
    return (
        <Wrapper className={className}>
            {store.isLoading ? (
                <span>Loading...</span>
            ) : (
                <ul>
                    {store.data.map(item => <li key={item}>{item}</li>)}
                </ul>
            )}
        </Wrapper>
    )
}

// === Styled Components ===

const Wrapper = styled.div`
    /* styles */
`
```

## 5. Public API

Export the main views and any reusable parts from `index.ts`. You can also create styled variations of your views here.

### Template: `index.ts`

```typescript
import styled from "styled-components"
import { [ViewName] } from "./views/[ViewName]"

export { [ViewName] }

// Example of a styled variation
export const Styled[ViewName] = styled([ViewName])`
    margin-top: 2rem;
`
```

## 6. Naming Conventions

- **Files**: PascalCase (e.g., `SearchSection.tsx`, `SearchStore.ts`).
- **Interfaces**: Prefix with `I` (e.g., `ISearchStore`).
- **Styled Components**: PascalCase, co-located at the bottom of the file.
- **Component Base**: `[Name]Base` for the function, exported as `observer([Name]Base)`.
