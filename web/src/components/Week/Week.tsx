import { useRef } from 'react'

import { Button } from 'react-bootstrap'
import {
  CreateEventMutation,
  CreateEventMutationVariables,
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'
import { useStore } from 'zustand'
import create from 'zustand'

import { useMutation } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/dist/toast'

import {
  CREATE_EVENT,
  eventToGql,
  formatTime,
  getTimeSlots,
  UPDATE_EVENT,
} from 'src/components/Scheduler/helpers'
import Scheduler from 'src/components/Scheduler/Scheduler'
import { Config, Event } from 'src/components/Scheduler/types'
import {
  createSchedulerStore,
  _generateEvent,
  SchedulerContext,
} from 'src/components/Scheduler/zstore'

import 'bootstrap/dist/css/bootstrap.min.css'
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

  console.log('rendering Week')

  const pageConfig: Config = {
    startTime: '06:00', // schedule start time(HH:ii)
    endTime: '10:00', // schedule end time(HH:ii)
    widthTime: 60 * 5, // 300 seconds per cell (5 minutes) ?
    timeLineY: 60, // height(px)
    dataWidth: 120,
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
      const gql_data = eventToGql(event, startDate)

      update({
        variables: {
          id: Number(event.data.entry),
          input: gql_data,
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

      const gql_data = eventToGql(event, startDate)
      console.log('gql data', gql_data)

      const resp = await create({ variables: { input: gql_data } })

      event.data.entry = resp.data.createEvent.id

      // TODO: handle db failure promise, toast. show loading?

      console.log(resp)

      addEvent(event)

      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].data.entry == event.data.entry) {
          setEvent(i, event)
          break
        }
      }

      // setEvent(i, event)
      showModal()
      // TODO: open modal here
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

  const store = useRef(
    createSchedulerStore({
      rows: props.rows,
      events: props.data,
      config: myConfig,
    })
  ).current

  const computed = useStore(store, (state) => state.computed)
  const events = useStore(store, (state) => state.events)
  const config = useStore(store, (state) => state.config)
  const addEvent = useStore(store, (state) => state.addEvent)
  const clearEvents = useStore(store, (state) => state.clearEvents)

  const modalVisible = usePageStore((state) => state.modalVisible)
  const showModal = usePageStore((state) => state.showModal)
  const hideModal = usePageStore((state) => state.hideModal)
  const setEvent = usePageStore((state) => state.setEvent)
  const currentEvent = usePageStore((state) => state.currentEvent)
  const eventIndex = usePageStore((state) => state.currentEventIndex)

  const _updateEvent = useStore(store, (state) => state.updateEvent)
  const _removeEvent = useStore(store, (state) => state.removeEvent)

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
        store={store}
        startDate={startDate}
        currentEvent={currentEvent}
        eventIndex={eventIndex}
        timeSlots={timeSlots}
        updateEvent={_updateEvent}
        removeEvent={_removeEvent}
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
    <SchedulerContext.Provider value={store}>
      <Toaster />
      {modal}
      {rand}
      <Scheduler />
      {props.children}
    </SchedulerContext.Provider>
  )
}

export default Week
