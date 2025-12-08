import { useNavigate } from '@tanstack/react-router'
import { ActorListView } from '../features/actors'

export function ActorListPage() {
  const navigate = useNavigate()

  const handleActorClick = (nconst: string) => {
    navigate({ to: '/actors/$actorId', params: { actorId: nconst } })
  }

  return (
    <ActorListView
      onActorClick={handleActorClick}
    />
  )
}
