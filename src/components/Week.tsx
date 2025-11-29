import { Button } from "react-bootstrap";
import { create } from "zustand";
import { eventToDb, getTimeSlots } from "../components/Scheduler/helpers";
import SchedulerComponent from "../components/Scheduler/Scheduler";
import { Config as SchedulerConfig, SchedulerState } from "../components/Scheduler/types";
import { Event as EventModel } from "~/utils/models";
import {
  createSchedulerStore,
  _generateEvent,
  SchedulerContext,
} from "../components/Scheduler/zstore";
import EventModal from "./EventModal";
import { Toaster } from "react-hot-toast";
import { triplit } from "triplit/client";
import { LocalDate, LocalTime } from "@js-joda/core";

interface PageState {
  modalVisible: boolean;
  currentEvent: EventModel | null;
  currentEventIndex: number | null;
  showModal: () => void;
  hideModal: () => void;
  setEvent: (index: number, event: EventModel) => void;
}

const usePageStore = create<PageState>()((set) => ({
  modalVisible: false,
  currentEvent: null,
  currentEventIndex: null,
  showModal: () => set(() => ({ modalVisible: true })),
  hideModal: () => set(() => ({ modalVisible: false })),
  setEvent: (index, event) => set(() => ({ currentEventIndex: index, currentEvent: event })),
}));

const Week = (props: {
  locationId: string;
  data: EventModel[];
  dates: LocalDate[];
  children: React.ReactNode;
  provideCreateRandom: boolean;
  config: SchedulerConfig;
  rows: string[];
}) => {
  const startDate = props.dates[0];

  // Find which row index corresponds to today
  const today = LocalDate.now();
  const currentDayIndex = props.dates.findIndex(date => date.equals(today));

  const pageConfig: SchedulerConfig = {
    startTime: LocalTime.parse("06:00"), // schedule start time(HH:ii)
    endTime: LocalTime.parse("10:00"), // schedule end time(HH:ii)
    widthTime: 60 * 5, // 300 seconds per cell (5 minutes) ?
    timeLineY: 60, // height(px)
    // dataWidth: 120,
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 0, // border(top and bottom)
    timeLinePaddingTop: 0,
    timeLinePaddingBottom: 20,
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    // draggable: isDraggable,
    // resizable: isResizable,
    resizableLeft: true,
    widthTimeX: 20, // 20 pixels per cell?
    currentDayIndex: currentDayIndex, // index of current day (-1 if not in this week)
    onClick: function (eventModel, rowNum, eventIndex) {
      if (rowNum < 0) throw new Error("rowNum must be >= 0");

      setEvent(eventIndex, eventModel);
      showModal();
    },

    onChange: async function (eventModel: EventModel, eventIndex: number) {
      const db_data = eventToDb(eventModel, startDate, props.locationId);

      const eventId = String(eventModel.data.entry);

      const updatedEvent = await triplit.update("events", eventId, {
        ...db_data,
        updated_at: new Date(),
      });

      // TODO: handle error case
    },
    onScheduleClick: async function (colNum, rowNum) {
      if (rowNum < 0) throw new Error("rowNum must be >= 0");

      // seconds since midnight?
      const startTimeValue =
        computed.tableStartTime.toSecondOfDay() + colNum * (config?.widthTime || 300);
      const endTimeValue = startTimeValue + 4 * (config?.widthTime || 300);

      const startTimeLocal = LocalTime.ofSecondOfDay(startTimeValue);
      const endTimeLocal = LocalTime.ofSecondOfDay(endTimeValue);

      // Create Date objects from the time values
      // const startTimeDate = new Date(startDate.getTime() + startTimeValue * 1000);
      // const endTimeDate = new Date(startDate.getTime() + endTimeValue * 1000);

      // const randId = 0 + Math.floor(Math.random() * 1000)

      const event: EventModel = {
        row: rowNum,
        start: startTimeLocal,
        end: endTimeLocal,
        text: "",
        data: {
          entry: "", // this will get reset once it makes it to db
          mode: "passenger",
        },
      };

      const db_data = eventToDb(event, startDate, props.locationId);

      const insertedEntity = await triplit.insert("events", {
        ...db_data,
        created_at: new Date(),
        updated_at: new Date(),
      });
      event.data.entry = insertedEntity.id;

      // TODO: handle db failure promise, toast. show loading?

      addEvent(event);

      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].data.entry == event.data.entry) {
          setEvent(i, event);
          break;
        }
      }

      showModal();
    },
  };

  const myConfig = { ...pageConfig, ...props.config };

  function addRandomEvent() {
    const times = getTimeSlots(
      computed.tableStartTime,
      computed.tableEndTime,
      config?.widthTime || 300
    );

    const newEvent = _generateEvent(times, props.rows.length);
    addEvent(newEvent);
  }

  const useStore = createSchedulerStore({
    rows: props.rows,
    events: props.data,
    config: myConfig,
  });

  const computed = useStore((state) => state.computed);
  const events = useStore((state) => state.events);
  const config = useStore((state) => state.config);
  const addEvent = useStore((state) => state.addEvent);
  const clearEvents = useStore((state) => state.clearEvents);

  const modalVisible = usePageStore((state) => state.modalVisible);
  const showModal = usePageStore((state) => state.showModal);
  const hideModal = usePageStore((state) => state.hideModal);
  const setEvent = usePageStore((state) => state.setEvent);
  const currentEvent = usePageStore((state) => state.currentEvent);
  const eventIndex = usePageStore((state) => state.currentEventIndex);

  const _updateEvent = useStore((state) => state.updateEvent);
  const _removeEvent = useStore((state) => state.removeEvent);

  const timeSlots = getTimeSlots(
    computed.tableStartTime,
    computed.tableEndTime,
    config?.widthTime || 300
  );

  let modal = <></>;
  if (modalVisible === true && currentEvent && eventIndex !== null) {
    modal = (
      <EventModal
        show={modalVisible}
        handleClose={hideModal}
        startDate={startDate}
        currentEvent={currentEvent}
        eventIndex={eventIndex}
        timeSlots={timeSlots}
        updateEvent={_updateEvent}
        removeEvent={_removeEvent}
        locationId={props.locationId}
      />
    );
  }

  let rand = <></>;
  if (props.provideCreateRandom) {
    rand = (
      <>
        <Button variant="primary" onClick={addRandomEvent}>
          Create random event
        </Button>

        <Button variant="primary" onClick={clearEvents}>
          Clear events
        </Button>
      </>
    );
  }

  return (
    <SchedulerContext.Provider value={useStore}>
      <Toaster />
      {modal}
      {rand}
      <SchedulerComponent />
      {props.children}
    </SchedulerContext.Provider>
  );
};

export default Week;
