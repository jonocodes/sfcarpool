import { Button } from "react-bootstrap";
import { create } from "zustand";

import {
  formatTime,
  getTimeSlots,
} from "../components/Scheduler/helpers";
import SchedulerComponent from "../components/Scheduler/Scheduler";
import { Config } from "../components/Scheduler/types";
import { Event } from "~/utils/models";
import {
  createSchedulerStore,
  _generateEvent,
  SchedulerContext,
} from "../components/Scheduler/zstore";

// import 'bootstrap/dist/css/bootstrap.min.css'
import EventModal from "./EventModal";
import { Toaster } from "react-hot-toast";
import { createEvent, modifyEvent } from "~/utils/db";

interface PageState {
  modalVisible: boolean;
  currentEvent: Event;
  currentEventIndex: number;
  showModal: () => void;
  hideModal: () => void;
  setEvent: (index: number, event: Event) => void;
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
  locationId: number;
  data: Event[];
  dates: Date[];
  children: React.ReactNode;
  provideCreateRandom: boolean;
  config: Config;
  rows: string[];
}) => {
  const startDate = props.dates[0];

  console.log("rendering Week, location", props.locationId, props.data);

  const pageConfig: Config = {
    startTime: "06:00", // schedule start time(HH:ii)
    endTime: "10:00", // schedule end time(HH:ii)
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
    onClick: function (event, rowNum, eventIndex) {
      console.log("onClick external method", event, rowNum, eventIndex);

      setEvent(eventIndex, event);
      showModal();
    },

    onChange: async function (event, _) {
      await modifyEvent(event, props.locationId);
    },
    onScheduleClick: async function (colNum, rowNum) {
      console.log("onScheduleClick external method", colNum, rowNum);

      const startTime = computed.tableStartTime + colNum * config.widthTime;
      const endTime = startTime + 4 * config.widthTime;

      const event: Event = {
        row: rowNum,
        start: formatTime(startTime),
        end: formatTime(endTime),
        text: "",
        data: {
          entry: 0, // this will get reset once it makes it to db
          mode: "passenger",
          likelihood: 95,
          date: props.dates[rowNum],
        },
      };

      const newEvent = await createEvent(event, props.locationId);

      event.data.entry = newEvent.id;

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
    const times = getTimeSlots(computed.tableStartTime, computed.tableEndTime, config.widthTime);

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

  console.log("week store events", events);

  // TODO: maybe move this to computed? so it does not regen with every change to the Week
  const timeSlots = getTimeSlots(computed.tableStartTime, computed.tableEndTime, config.widthTime);

  let modal = <></>;
  if (modalVisible === true) {
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

  // I could not figure out how to inject this from stories, so for now rand is initiated in this component
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
