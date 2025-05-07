import { useRef, useState } from 'react'

import { Button } from 'react-bootstrap'
import {
  CreateEventMutation,
  CreateEventMutationVariables,
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'
// import { createStore, useStore } from 'zustand'
import create from 'zustand'

import { useMutation } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/toast'

import {
  CREATE_EVENT,
  eventToGql,
  formatTime,
  getTimeSlots,
  UPDATE_EVENT,
} from 'src/components/Scheduler/helpers'
import Scheduler from 'src/components/Scheduler/Scheduler'
import { Config, Event, SchedulerState } from 'src/components/Scheduler/types'
import {
  createSchedulerStore,
  _generateEvent,
  SchedulerContext,
  configDefault,
  refreshComputed,
} from 'src/components/Scheduler/zstore'

// import 'bootstrap/dist/css/bootstrap.min.css'
import EventModal from '../EventModal/EventModal'

interface PageState {
  modalVisible: boolean
  currentEvent: Event
  currentEventIndex: number
  showModal: () => void
  hideModal: () => void
  setEvent: (index: number, event: Event) => void
}

const usePageStore = create<PageState>()((set) => ({
  modalVisible: false,
  currentEvent: null,
  currentEventIndex: null,
  showModal: () => set(() => ({ modalVisible: true })),
  hideModal: () => set(() => ({ modalVisible: false })),
  setEvent: (index, event) =>
    set(() => ({ currentEventIndex: index, currentEvent: event })),
}))

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

const Week = (props) => {
  const [create /*{ loading, error }*/] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CREATE_EVENT, {
    // onCompleted: (a) => {
    //   console.log(a)
    //   toast.success('Thank you for your submission!')
    // },
  })

  const [update] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    // onCompleted: (a) => {
    //   console.log(a)
    //   toast.success('Thank you for your submission!')
    // },
  })

  const startDate = props.dates[0]

  console.log('rendering Week, location', props.locationId, props.data)

  const pageConfig: Config = {
    startTime: '06:00', // schedule start time(HH:ii)
    endTime: '10:00', // schedule end time(HH:ii)
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
      console.log('onClick external method', event, rowNum, eventIndex)

      setEvent(eventIndex, event)
      showModal()
    },

    onChange: async function (event, _) {
      const gql_data = eventToGql(event, startDate, props.locationId)

      update({
        variables: {
          ...gql_data,
          ...{ id: Number(event.data.entry) },

          // gql_data.concat()
          // id: Number(event.data.entry),
          // input: gql_data,
        },
      }) //then.error, toast error
    },
    onScheduleClick: async function (colNum, rowNum) {
      console.log('onScheduleClick external method', colNum, rowNum)

      const startTime = computed.tableStartTime + colNum * config.widthTime
      const endTime = startTime + 4 * config.widthTime

      // const randId = 0 + Math.floor(Math.random() * 1000)

      const event = {
        row: rowNum,
        start: formatTime(startTime),
        end: formatTime(endTime),
        text: '',
        data: {
          entry: 0, // this will get reset once it makes it to db
          mode: 'passenger',
          likelihood: 95,
        },
      }

      const gql_data = eventToGql(event, startDate, props.locationId)
      console.log('create gql data', gql_data)

      const resp = await create({ variables: gql_data })

      console.log('new id', resp, event)
      event.data.entry = resp.data.insert_events.returning[0].id

      // TODO: handle db failure promise, toast. show loading?

      addEvent(event)

      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].data.entry == event.data.entry) {
          setEvent(i, event)
          break
        }
      }

      // setEvent(i, event)
      showModal()
    },
  }

  const myConfig = { ...pageConfig, ...props.config }

  function addRandomEvent() {
    const times = getTimeSlots(
      computed.tableStartTime,
      computed.tableEndTime,
      config.widthTime
    )

    const newEvent = _generateEvent(times, props.rows.length)
    addEvent(newEvent)
  }

  // const [evnts, setEvnts] = useState(props.data)

  // props.data[0].data['rand'] = Math.random().toString()

  const useStore = createSchedulerStore({
    rows: props.rows,
    events: props.data, // TODO: the location switch issue is probably here
    config: myConfig,
  })

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

  const computed = useStore((state) => state.computed)
  const events = useStore((state) => state.events)
  const config = useStore((state) => state.config)
  const addEvent = useStore((state) => state.addEvent)
  const clearEvents = useStore((state) => state.clearEvents)

  const modalVisible = usePageStore((state) => state.modalVisible)
  const showModal = usePageStore((state) => state.showModal)
  const hideModal = usePageStore((state) => state.hideModal)
  const setEvent = usePageStore((state) => state.setEvent)
  const currentEvent = usePageStore((state) => state.currentEvent)
  const eventIndex = usePageStore((state) => state.currentEventIndex)

  const _updateEvent = useStore((state) => state.updateEvent)
  const _removeEvent = useStore((state) => state.removeEvent)

  // const setup = useStore(store, (state) => state.setup)
  // setup(myConfig, props.rows, props.data)

  console.log('week store events', events)

  // TODO: maybe move this to computed? so it does not regen with every change to the Week
  const timeSlots = getTimeSlots(
    computed.tableStartTime,
    computed.tableEndTime,
    config.widthTime
  )

  let modal = <></>
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
    )
  }

  // I could not figure out how to inject this from stories, so for now rand is initiated in this component
  let rand = <></>
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
    )
  }

  return (
    <SchedulerContext.Provider value={useStore}>
      <Toaster />
      {modal}
      {rand}
      <Scheduler />
      {props.children}
    </SchedulerContext.Provider>
  )
}

export default Week
