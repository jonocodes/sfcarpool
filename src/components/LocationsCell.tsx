// import React from 'react'
import { Form, Placeholder } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

interface Location {
  id: number;
  name: string;
}

interface ApiResponseItem {
  key: string;
  value: { id: string; name: string; uuid: string };
  headers: { operation: string; relation: string[] };
}

// // Mock data for locations
// const mockLocations = [
//   { id: 1, name: "Berkeley -> SF" },
//   { id: 2, name: "Oakland -> SF" },
//   { id: 3, name: "Orinda -> SF" },
// ];

// return new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(mockLocations);
//   }, 500); // Simulate network delay
// });

// Mock API call to fetch locations
const fetchLocations = async (): Promise<Location[]> => {
  const response = await fetch("http://localhost:4000/v1/shape?table=locations&offset=-1");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ApiResponseItem[] = await response.json();
  return data.map((item) => ({
    id: parseInt(item.value.id, 10),
    name: item.value.name,
  }));
};

const LocationsCell = ({ locationId, week }: { locationId: number; week: string }) => {
  const {
    data: locations,
    isLoading,
    isError,
    error,
  } = useQuery<Location[], Error>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  // TODO: use "suspense" to show loading state?
  if (isLoading) {
    return <Placeholder />;
  }

  if (isError && error instanceof Error) {
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
      {locations.map((item: { id: number; name: string }) => (
        <option key={item.id} aria-label="location" value={item.id}>
          {item.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default LocationsCell;
