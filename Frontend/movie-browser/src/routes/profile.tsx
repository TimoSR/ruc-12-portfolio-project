import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './_layout'

import { UserProfileView } from '../features/Chris/auth/views/UserProfileView.jsx'

export const Route = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: '/profile',
    component: UserProfileView,
})
