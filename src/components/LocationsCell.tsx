// import React from 'react'
import { Form, Placeholder } from "react-bootstrap";
// import { useQuery } from "@tanstack/react-query";
import { useShape } from "@electric-sql/react";
// Once you run the generator, uncomment this:
// import { Location } from '../generated/db'

// Remove this once you import the generated type
interface Location {
  // Keep it simple, electric-sql should map to this
  id: number;
  name: string;
  [key: string]: any; // Add index signature back
}

// interface ApiResponseItem {
// key: string;
// value: { id: string; name: string; uuid: string };
// headers: { operation: string; relation: string[] };
// }

// // Mock data for locations
// const mockLocations = [
// { id: 1, name: "Berkeley -> SF" },
// { id: 2, name: "Oakland -> SF" },
// { id: 3, name: "Orinda -> SF" },
// ];

// // return new Promise((resolve) => {
// // setTimeout(() => {
// // resolve(mockLocations);
// // }, 500); // Simulate network delay
// // });

// // Mock API call to fetch locations
// const fetchLocations = async (): Promise<Location[]> => {
// const response = await fetch("http://localhost:4000/v1/shape?table=locations&offset=-1");
// if (!response.ok) {
// throw new Error("Network response was not ok");
// }
// const data: ApiResponseItem[] = await response.json();
// return data.map((item) => ({
// id: parseInt(item.value.id, 10),
// name: item.value.name,
// }));
// };

const LocationsCell = ({ locationId, week }: { locationId: number; week: string }) => {
  const {
    data: locations,
    isLoading,
    error,
    // isError, // Removed as useShape returns error directly
  } = useShape<Location>({
    url: "http://localhost:5133/v1/shape",
    params: {
      table: "locations",
      // offset: -1 // Assuming electric-sql handles this or has a different way
    },
  });

  // TODO: use "suspense" to show loading state?
  if (isLoading) {
    return <Placeholder />;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error.message}</div>;
  }

  if (!locations || locations.length === 0) {
    return <div>Empty</div>;
  }

  return (
    <Form.Select
      className="select"
      aria-label="choose location"
      defaultValue={locationId}
      onChange={(e) => {
        const selectedLocation = e.target.value;
        console.log(`Navigating to scheduler with location: ${selectedLocation}, week: ${week}`);
        // Replace with your navigation logic
      }}
      // variant="dark"
    >
      {locations &&
        locations.map((item: Location) => (
          <option key={item.id} aria-label="location" value={item.id}>
            {item.name}
          </option>
        ))}
    </Form.Select>
  );
};

export default LocationsCell;
