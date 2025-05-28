import type { ComponentStory } from '@storybook/react'

// import { Loading, Empty, Failure, Success } from './LocationsCell'
import { standard } from './LocationsCell.mock'
import LocationsCell from './LocationsCell'

// export const loading = () => {
//   return Loading ? <Loading /> : <></>
// }

// export const empty = () => {
//   return Empty ? <Empty /> : <></>
// }

// export const failure: ComponentStory<typeof Failure> = (args) => {
//   return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
// }

// export const success: ComponentStory<typeof Success> = (args) => {
//   return Success ? <Success {...standard()} {...args} /> : <></>
// }

export const LocationsCellX: ComponentStory<typeof LocationsCell> = (args) => {
  return <LocationsCell {...standard()} {...args} />
}

export default { title: 'Cells/LocationsCell' }
