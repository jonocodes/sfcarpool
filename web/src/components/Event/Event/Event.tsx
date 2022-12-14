
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag,  } from 'src/lib/formatters'

import type { DeleteEventMutationVariables, FindEventById } from 'types/graphql'

const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEventMutation($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`

interface Props {
  event: NonNullable<FindEventById['event']>
}

const Event = ({ event }: Props) => {
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('Event deleted')
      navigate(routes.events())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteEventMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete event ' + id + '?')) {
      deleteEvent({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Event {event.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{event.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(event.createdAt)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(event.updatedAt)}</td>
            </tr><tr>
              <th>Label</th>
              <td>{event.label}</td>
            </tr><tr>
              <th>Date</th>
              <td>{timeTag(event.date)}</td>
            </tr><tr>
              <th>Start</th>
              <td>{timeTag(event.start)}</td>
            </tr><tr>
              <th>End</th>
              <td>{timeTag(event.end)}</td>
            </tr><tr>
              <th>Passenger</th>
              <td>{checkboxInputTag(event.passenger)}</td>
            </tr><tr>
              <th>likelihood</th>
              <td>{event.likelihood}</td>
            </tr><tr>
              <th>Active</th>
              <td>{checkboxInputTag(event.active)}</td>
            </tr><tr>
              <th>Location id</th>
              <td>{event.locationId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editEvent({ id: event.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(event.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Event
