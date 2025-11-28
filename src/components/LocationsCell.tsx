import { Form } from "react-bootstrap";
import { Location } from "~/utils/models";
import { useNavigate } from "@tanstack/react-router";
import { triplit } from "../../triplit/client";
import { useState, useEffect } from "react";

const LocationsCell = ({ locationId, week }: { locationId: string; week: string }) => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const query = triplit.query("locations");
    const unsubscribe = triplit.subscribe(query, (data) => {
      setLocations(data);
    });

    return () => unsubscribe();
  }, []);

  if (!locations || locations.length === 0) {
    return <div>Empty</div>;
  }

  return (
    <Form.Select
      className="select"
      aria-label="choose location"
      defaultValue={locationId}
      onChange={(e) => {
        navigate({
          to: "/scheduler",
          search: {
            location: e.target.value,
            week: week,
          },
        });
      }}
    >
      {locations.map((item: Location) => (
        <option key={item.id} aria-label="location" value={item.id}>
          {item.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default LocationsCell;
