import { eventToDbRepresentation } from "~/components/Scheduler/helpers";
import { Event, EventInDb } from "~/utils/models";

const POSTGRES_URL = "http://localhost:4000";

export async function createEvent(event: Event, locationId: number): Promise<EventInDb> {
  const eventForDb = eventToDbRepresentation(event, locationId);
  console.log("create data", eventForDb);

  const response = await fetch(`${POSTGRES_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(eventForDb),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const newEvent = await response.json();
  return newEvent[0]; // PostgREST returns an array with the inserted row
}

export async function modifyEvent(event: Event, locationId: number): Promise<EventInDb> {
  const eventInDb = eventToDbRepresentation(event, locationId);

  const response = await fetch(`${POSTGRES_URL}/events?id=eq.${event.data.entry}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(eventInDb),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const updatedEvent = await response.json();
  console.log("Event updated:", updatedEvent);

  return updatedEvent[0];
}

export async function deleteEvent(event: Event): Promise<void> {
  const response = await fetch(`${POSTGRES_URL}/events?id=eq.${event.data.entry}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const deletedEvents = await response.json();
  if (!Array.isArray(deletedEvents) || deletedEvents.length === 0) {
    throw new Error("Delete operation failed - no records were deleted");
  }

  return deletedEvents[0];
}
