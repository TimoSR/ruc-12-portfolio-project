import { useNavigate } from '@tanstack/react-router'
import { ActorDetailsView } from '../features/actors'
import { actorDetailsRoute } from '../routes';

export function ActorDetailsPage() {
  const navigate = useNavigate()
  const { actorId } = actorDetailsRoute.useParams();

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
