// ActorDetailsPage.tsx
import { useNavigate } from '@tanstack/react-router';
import { actorDetailsRoute, actorListRoute } from '../routes';
import { ActorDetailsView } from '../features/Chris/actors';

export function ActorDetailsPage() {
  const { actorId } = actorDetailsRoute.useParams();

  // Use the *fullPath* of the current route for "from"
  const navigate = useNavigate({ from: actorDetailsRoute.fullPath });

  const handleBack = (): void => {
    // Navigate to the actor list route in a type-safe way
    void navigate({ to: actorListRoute.fullPath });
  };

  return (
    <ActorDetailsView
      actorId={actorId}
      onBack={handleBack}
    />
  );
}
