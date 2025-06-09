// import { useRef, useState } from 'react'

import { Button } from "react-bootstrap";
// import {
//   CreateEventMutation,
//   CreateEventMutationVariables,
//   UpdateEventMutation,
//   UpdateEventMutationVariables,
// } from 'types/graphql'
// import { createStore, useStore } from 'zustand'
import { create } from "zustand";

import {
  // CREATE_EVENT,
  eventToDbRepresentation,
  formatTime,
  getTimeSlots,
  // UPDATE_EVENT,
} from "../components/Scheduler/helpers";
import SchedulerComponent from "../components/Scheduler/Scheduler";
import { Config, SchedulerState } from "../components/Scheduler/types";
import { Event } from "~/utils/models";
import {
  createSchedulerStore,
  _generateEvent,
  SchedulerContext,
  configDefault,
  refreshComputed,
} from "../components/Scheduler/zstore";

// import 'bootstrap/dist/css/bootstrap.min.css'
import EventModal from "./EventModal";
import { Toaster } from "react-hot-toast";

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
      const eventInDb = eventToDbRepresentation(event, startDate, props.locationId);

      // update({
      //   variables: {
      //     ...gql_data,
      //     ...{ id: Number(event.data.entry) },

      //     // gql_data.concat()
      //     // id: Number(event.data.entry),
      //     // input: gql_data,
      //   },
      // }); //then.error, toast error
    },
    onScheduleClick: async function (colNum, rowNum) {
      console.log("onScheduleClick external method", colNum, rowNum);

      const startTime = computed.tableStartTime + colNum * config.widthTime;
      const endTime = startTime + 4 * config.widthTime;

      // const randId = 0 + Math.floor(Math.random() * 1000)

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

      const eventForDb = eventToDbRepresentation(event, props.locationId);
      console.log("create data", eventForDb);

      // const resp = await create({ variables: eventForDb });

      const response = await fetch(`http://localhost:4000/events`, {
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
      console.log("new event created:", newEvent);
      event.data.entry = newEvent[0].id; // PostgREST returns an array with the inserted row

      // TODO: handle db failure promise, toast. show loading?

      addEvent(event);

      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].data.entry == event.data.entry) {
          setEvent(i, event);
          break;
        }
      }

      // setEvent(i, event)
      showModal();
    },
  };

  const myConfig = { ...pageConfig, ...props.config };

  function addRandomEvent() {
    const times = getTimeSlots(computed.tableStartTime, computed.tableEndTime, config.widthTime);

    const newEvent = _generateEvent(times, props.rows.length);
    addEvent(newEvent);
  }

  // const [evnts, setEvnts] = useState(props.data)

  // props.data[0].data['rand'] = Math.random().toString()

  const useStore = createSchedulerStore({
    rows: props.rows,
    events: props.data, // TODO: the location switch issue is probably here
    config: myConfig,
  });

  // const store2 = createSchedulerStore({
  //   rows: props.rows,
  //   events: props.data, // TODO: the location switch issue is probably here
  //   config: myConfig,
  // })

  // const storeRef = useRef(_store)

  // const store = useRef(_store).current

  // useEffect(() => _store.subscribe(
  //   scratches => (scratchRef.current = scratches),
  //   state => state.scratches
  // ), [])

  // console.log('store', store)

  // const store = createSchedulerStore({
  //   rows: props.rows,
  //   events: props.data, // TODO: the location switch issue is probably here
  //   config: myConfig,
  // })

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

  // const setup = useStore(store, (state) => state.setup)
  // setup(myConfig, props.rows, props.data)

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
