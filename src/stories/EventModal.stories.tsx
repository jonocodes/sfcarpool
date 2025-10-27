import type { Meta } from "@storybook/react";
// import { DateTime } from 'luxon'
import { calcStringTime, getTimeSlots } from "../components/Scheduler/helpers";
import EventModal from "../components/EventModal";
import { LocalDate, LocalTime } from "@js-joda/core";

// import { calcStringTime, getTimeSlots } from '../Scheduler/helpers'

// import EventModal from './EventModal'

export const updateEvent = () => {
  // const [modalVisible, setModalVisible] = useState(true)

  // const

  const startDate = LocalDate.parse("2022-09-20");

  const events = [
    {
      row: 0, // monday
      start: LocalTime.parse("8:00"),
      end: LocalTime.parse("8:10"),
      text: "JK",
      data: {
        entry: 8,
        mode: "passenger",
        likelihood: 20,
      },
    },
  ];

  function hideModal() {
    // do nothing
  }

  const widthTime = 600;

  let tableStartTime = calcStringTime("7:00");
  tableStartTime -= tableStartTime % widthTime;
  // tableStartTime = 0

  let tableEndTime = calcStringTime("12:30");
  tableEndTime -= tableEndTime % widthTime;

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

export default {
  title: "Components/EventModal",
  component: EventModal,
} as Meta<typeof EventModal>;
