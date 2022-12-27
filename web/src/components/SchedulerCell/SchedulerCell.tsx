import type {
  FindSchedulerQuery,
  FindSchedulerQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindSchedulerQuery($id: Int!) {
    scheduler: scheduler(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindSchedulerQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  scheduler,
}: CellSuccessProps<FindSchedulerQuery, FindSchedulerQueryVariables>) => {
  return <div>{JSON.stringify(scheduler)}</div>
}
