import { Form } from 'react-bootstrap'
import type { LocationsQuery } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

// NOTE: only using one location until I figure the page change bug
export const QUERY = gql`
  query LocationsQuery {
    # locations(where: { id: { _eq: 1 } }) {
    locations {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  locations,
  locationId,
  week,
}: // setLocationId,
CellSuccessProps<LocationsQuery>) => {
  // console.log(locations)

  // const { week } = useParams()
  return (
    <Form.Select
      aria-label="choose location"
      defaultValue={locationId}
      // onChange={(e) => setLocationId(e.target.value)}

      // onChange={(e) =>  navigate(routes.home(
      onChange={(e) =>
        navigate(routes.scheduler({ location: e.target.value, week: week }))
      }
      // )}
    >
      {locations.map((item) => {
        return (
          <option key={item.id} aria-label="location" value={item.id}>
            {item.name}
          </option>
        )
      })}
    </Form.Select>
  )
}
