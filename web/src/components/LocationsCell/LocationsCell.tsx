import { Form } from 'react-bootstrap'
import type { LocationsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query LocationsQuery {
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
  setLocationId,
}: CellSuccessProps<LocationsQuery>) => {
  // console.log(locations)

  return (
    <Form.Select
      aria-label="choose location"
      defaultValue={1}
      onChange={(e) => setLocationId(e.target.value)}
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
