import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './_layout'

import { BookmarksView } from '../features/Chris/bookmarks/views/BookmarksView.jsx'

export const Route = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/bookmarks',
    component: BookmarksView,
})
