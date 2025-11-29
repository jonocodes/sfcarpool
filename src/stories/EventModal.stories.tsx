import type { Meta, StoryObj } from "@storybook/react-vite";
import { getTimeSlots } from "../components/Scheduler/helpers";
import EventModal from "../components/EventModal";
import { LocalDate, LocalTime } from "@js-joda/core";

const meta = {
  title: "Components/EventModal",
  component: EventModal,
} satisfies Meta<typeof EventModal>;

export default meta;

const UpdateEventComponent = () => {
  const startDate = LocalDate.parse("2022-09-20");

  const events = [
    {
      row: 0, // monday
      start: LocalTime.parse("08:00"),
      end: LocalTime.parse("08:10"),
      text: "JK",
      data: {
        entry: 8,
        mode: "passenger",
      },
    },
  ];

  function hideModal() {
    // do nothing
  }

  const widthTime = 600;

  const tableStartTime = LocalTime.parse("07:00");
  const tableEndTime = LocalTime.parse("12:30");

  const timeSlots = getTimeSlots(tableStartTime, tableEndTime, widthTime);

  return (
    <EventModal
      show={true}
      handleClose={hideModal}
      removeEvent={() => {}}
      updateEvent={() => {}}
      locationId={"1"}
      startDate={startDate}
      currentEvent={events[0]}
      eventIndex={0}
      timeSlots={timeSlots}
    />
  );
};

export const UpdateEvent: StoryObj = {
  render: () => <UpdateEventComponent />,
};
