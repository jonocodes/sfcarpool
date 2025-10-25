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

// import { useMutation } from '@redwoodjs/web'
// import { Toaster } from '@redwoodjs/web/toast'

import {
  // CREATE_EVENT,
  eventToDb,
  formatTime,
  getTimeSlots,
  // UPDATE_EVENT,
} from "../components/Scheduler/helpers";
import SchedulerComponent from "../components/Scheduler/Scheduler";
import { Config as SchedulerConfig, SchedulerState } from "../components/Scheduler/types";
import { Event as EventModel } from "~/utils/models";
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

// const store = createStore<SchedulerState>((set) => ({
//   rows: [],
//   events: [],
//   config: {},
//   computed: {
//     rowMap: [],
//     geometries: [],
//     rowHeights: [],
//     tableHeight: 0,
//     tableStartTime: 0,
//     tableEndTime: 0,
//     cellsWide: 0,
//     scrollWidth: 0,
//   },
//   onClickEvent: null,
//   currentEvent: null,
//   currentEventIndex: null,
//   // count: 1,
//   // inc: () => set((state) => ({ count: state.count + 1 })),

//   setup: (config, rows, events) =>
//     set((state) => {
//       state.config = { ...configDefault, ...config }
//       state.rows = rows
//       state.events = events

//       const computed = refreshComputed(config, rows, events)

//       return {
//         rows: state.rows,
//         config: state.config,
//         events: state.events,
//         computed: computed,
//       }
//     }),

//   clearEvents: () =>
//     // this is a helper function for dev and testing only
//     set((state) => {
//       state.events = []

//       const computed = refreshComputed(state.config, state.rows, state.events)

//       return {
//         events: state.events,
//         computed: computed,
//       }
//     }),

//   addEvent: (event: Event) =>
//     set((state) => {
//       state.events.push(event)
//       const computed = refreshComputed(state.config, state.rows, state.events)

//       return {
//         currentEvent: event,
//         events: state.events,
//         computed: computed,
//       }
//     }),

//   removeEvent: (eventIndex: number) =>
//     set((state) => {
//       state.events.splice(eventIndex, 1)

//       const computed = refreshComputed(state.config, state.rows, state.events)

//       console.log('removeEvent', eventIndex, state.events, computed)

//       return {
//         // currentEvent: event,
//         events: state.events,
//         computed: computed,
//       }
//     }),

//   updateEvent: (eventIndex: number, event: Event) =>
//     set((state) => {
//       console.log('updateEvent', eventIndex, event)

//       state.events[eventIndex] = event
//       const computed = refreshComputed(state.config, state.rows, state.events)

//       console.log(
//         'updateEvent finished',
//         eventIndex,
//         event,
//         state.events[eventIndex],
//         computed.geometries[eventIndex]
//       )

//       return {
//         currentEvent: event,
//         events: state.events,
//         computed: computed,
//       }
//     }),
// }))

// const store = createSchedulerStore({
//   rows: [],
//   events: [],
//   config: {},
// })

const Week = (props: {
  locationId: string;
  data: EventModel[];
  dates: LocalDate[];
  children: React.ReactNode;
  provideCreateRandom: boolean;
  config: SchedulerConfig;
  rows: string[];
}) => {
  // const [create /*{ loading, error }*/] = useMutation<
  //   CreateEventMutation,
  //   CreateEventMutationVariables
  // >(CREATE_EVENT, {
  //   // onCompleted: (a) => {
  //   //   console.log(a)
  //   //   toast.success('Thank you for your submission!')
  //   // },
  // })

  // const [update] = useMutation<
  //   UpdateEventMutation,
  //   UpdateEventMutationVariables
  // >(UPDATE_EVENT, {
  //   // onCompleted: (a) => {
  //   //   console.log(a)
  //   //   toast.success('Thank you for your submission!')
  //   // },
  // })

  const startDate = props.dates[0];

  console.log("rendering Week, location", props.locationId, props.data);

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
    onClick: function (eventModel, rowNum, eventIndex) {
      if (rowNum < 0) throw new Error("rowNum must be >= 0");

      console.log("onClick external method", eventModel, rowNum, eventIndex);

      setEvent(eventIndex, eventModel);
      showModal();
    },

    onChange: async function (eventModel, _) {
      const gql_data = eventToDb(eventModel, startDate, props.locationId);

      // update({
      //   variables: {
      //     ...gql_data,
      //     ...{ id: Number(eventModel.data.entry) },

      //     // gql_data.concat()
      //     // id: Number(eventModel.data.entry),
      //     // input: gql_data,
      //   },
      // }); //then.error, toast error
    },
    onScheduleClick: async function (colNum, rowNum) {
      if (rowNum < 0) throw new Error("rowNum must be >= 0");

      console.log("onScheduleClick external method", colNum, rowNum);

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
          likelihood: 95,
        },
      };

      const db_data = eventToDb(event, startDate, props.locationId);
      console.log("create gql data", db_data);

      const insertedEntity = await triplit.insert("events", {
        ...db_data,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log("new id", insertedEntity, event);
      event.data.entry = insertedEntity.id;

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
    const times = getTimeSlots(
      computed.tableStartTime,
      computed.tableEndTime,
      config?.widthTime || 300
    );

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
        startDate={new Date(startDate.toString())}
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
