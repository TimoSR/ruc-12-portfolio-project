import { createFileRoute } from '@tanstack/react-router'
import { ProfileView } from '../features/Chris/profile/views/ProfileView'

export const Route = createFileRoute('/profile')({
    component: ProfileView,
})
