// ActorDetailsPage.tsx
import { useNavigate } from '@tanstack/react-router';

import { PersonDetailsView } from '../features/Chris/persons/views/PersonDetailsView';
import { PERSON_DEFAULTS, personDetailsRoute, personListRoute } from '../routes/persons';

export function PersonDetailsPage() {
  const { personId } = personDetailsRoute.useParams();

  // Use the *fullPath* of the current route for "from"
  const navigate = useNavigate({ from: personDetailsRoute.fullPath });

  const handleBack = (): void => {
    // ✅ FIX 2: Use string path + Provide REQUIRED search params
    navigate({ 
      to: personListRoute.fullPath,
      search: PERSON_DEFAULTS
    });
  };

  return (
    <PersonDetailsView
      actorId={personId}
      onBack={handleBack}
    />
  );
}


