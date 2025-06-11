import { Form, Placeholder } from "react-bootstrap";
import { useShape } from "@electric-sql/react";
import { Location } from "~/utils/models";
import { useNavigate } from "@tanstack/react-router";
import { config } from "~/config";

const ELECTRIC_URL = import.meta.env.VITE_ELECTRIC_URL || "http://localhost:5133/v1/shape";

const LocationsCell = ({ locationId, week }: { locationId: number; week: string }) => {
  const navigate = useNavigate();

  const {
    data: locations,
    isLoading,
    error,
  } = useShape<Location>({
    // TODO: centralized the db state using @tanstack/db-collection once its stable/released

    url: config.electricUrl,
    params: {
      table: "locations",
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
        navigate({
          to: "/scheduler",
          search: {
            location: Number(selectedLocation),
            week: week,
          },
        });
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
