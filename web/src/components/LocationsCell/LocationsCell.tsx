import React from 'react'
import { Form, Placeholder } from 'react-bootstrap'

// Mock data for locations
const mockLocations = [
  { id: 1, name: 'Berkeley -> SF' },
  { id: 2, name: 'Oakland -> SF' },
  { id: 3, name: 'Orinda -> SF' },
]

// Mock API call to fetch locations
const fetchLocations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLocations)
    }, 500) // Simulate network delay
  })
}

const LocationsCell = ({ locationId, week }: { locationId: number; week: string }) => {
  // const { data: locations, isLoading, isError, error } = useQuery(['locations'], fetchLocations)

  const isLoading = false // Replace with actual loading state
  const isError = false // Replace with actual error state
  const error = null // Replace with actual error object
  const locations = mockLocations // Replace with actual data from the query

  if (isLoading) {
    return <Placeholder />
  }

  if (isError) {
    return <div style={{ color: 'red' }}>Error: {(error as Error).message}</div>
  }

  if (!locations || locations.length === 0) {
    return <div>Empty</div>
  }

  return (
    <Form.Select
      className="select"
      aria-label="choose location"
      defaultValue={locationId}
      onChange={(e) => {
        const selectedLocation = e.target.value
        console.log(`Navigating to scheduler with location: ${selectedLocation}, week: ${week}`)
        // Replace with your navigation logic
      }}
      variant="dark"
    >
      {locations.map((item: { id: number; name: string }) => (
        <option key={item.id} aria-label="location" value={item.id}>
          {item.name}
        </option>
      ))}
    </Form.Select>
  )
}

export default LocationsCell
