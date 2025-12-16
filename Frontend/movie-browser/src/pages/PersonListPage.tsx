import { useNavigate } from '@tanstack/react-router'
import { PersonListView } from '../features/Chris/persons/views/PersonListView'

export function PersonListPage() {
  const navigate = useNavigate()

  const handleActorClick = (personId: string) => {
    navigate({ to: '/persons/$personId', params: { personId } })
  }

  return (
    <PersonListView
      onActorClick={handleActorClick}
    />
  )
}
