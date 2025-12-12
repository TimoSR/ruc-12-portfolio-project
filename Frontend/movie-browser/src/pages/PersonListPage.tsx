import { useNavigate } from '@tanstack/react-router'
import { ActorListView } from '../features/Chris/actors'

export function PersonListPage() {
  const navigate = useNavigate()

  const handleActorClick = (nconst: string) => {
    navigate({ to: '/persons/$personId', params: { personId: nconst } })
  }

  return (
    <ActorListView
      onActorClick={handleActorClick}
    />
  )
}
