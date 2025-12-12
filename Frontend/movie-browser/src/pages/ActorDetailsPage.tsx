// ActorDetailsPage.tsx
import { useNavigate } from '@tanstack/react-router';
import { ActorDetailsView } from '../features/Chris/actors';
import { actorDetailsRoute } from '../routes';

export function ActorDetailsPage() {
  const { actorId } = actorDetailsRoute.useParams();

  // Use the *fullPath* of the current route for "from"
  const navigate = useNavigate({ from: actorDetailsRoute.fullPath });

  const handleBack = (): void => {
    // ✅ FIX 2: Use string path + Provide REQUIRED search params
    navigate({ 
      to: '/actors',
      search: { 
        page: 1, 
        pageSize: 20, 
        query: '' 
      } 
    });
  };

  return (
    <ActorDetailsView
      actorId={actorId}
      onBack={handleBack}
    />
  );
}
