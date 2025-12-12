// ActorDetailsPage.tsx
import { useNavigate } from '@tanstack/react-router';
import { ActorDetailsView } from '../features/Chris/actors';
import { personDetailsRoute, personListRoute, type personSearch } from '../routes/persons';

export function PersonDetailsPage() {
  const { personId } = personDetailsRoute.useParams();

  // Use the *fullPath* of the current route for "from"
  const navigate = useNavigate({ from: personDetailsRoute.fullPath });

  const handleBack = (): void => {
    // ✅ FIX 2: Use string path + Provide REQUIRED search params
    navigate({ 
      to: personListRoute.fullPath,
      search: { 
        page: 1, 
        pageSize: 20, 
        query: '' 
      } as personSearch
    });
  };

  return (
    <ActorDetailsView
      actorId={personId}
      onBack={handleBack}
    />
  );
}
