import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Event/EventsCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

import type { DeleteEventMutationVariables, FindEvents } from 'types/graphql'

const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEventMutation($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`

const EventsList = ({ events }: FindEvents) => {
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('Event deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteEventMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete event ' + id + '?')) {
      deleteEvent({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Label</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Passenger</th>
            <th>likelihood</th>
            <th>Active</th>
            <th>Location id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{truncate(event.id)}</td>
              <td>{timeTag(event.createdAt)}</td>
              <td>{timeTag(event.updatedAt)}</td>
              <td>{truncate(event.label)}</td>
              <td>{timeTag(event.date)}</td>
              <td>{timeTag(event.start)}</td>
              <td>{timeTag(event.end)}</td>
              <td>{checkboxInputTag(event.passenger)}</td>
              <td>{truncate(event.likelihood)}</td>
              <td>{checkboxInputTag(event.active)}</td>
              <td>{truncate(event.locationId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.event({ id: event.id })}
                    title={'Show event ' + event.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editEvent({ id: event.id })}
                    title={'Edit event ' + event.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete event ' + event.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(event.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventsList
