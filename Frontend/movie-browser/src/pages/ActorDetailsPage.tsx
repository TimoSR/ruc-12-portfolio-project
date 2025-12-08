import { useNavigate, useParams } from '@tanstack/react-router'
import { ActorDetailsView } from '../features/actors'

export function ActorDetailsPage() {
  const navigate = useNavigate()
  const { actorId } = useParams({ from: '/actors/$actorId' })

  const handleBack = () => {
    navigate({ to: '/actors' })
  }

  return (
    <ActorDetailsView
      actorId={actorId}
      onBack={handleBack}
    />
  )
}
