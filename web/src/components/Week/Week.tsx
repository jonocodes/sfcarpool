import { useContext, useRef, useState } from 'react'

import {
  Button,
  Form,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap'
import { useStore } from 'zustand'
import create from 'zustand'

import { formatTime } from 'src/components/Scheduler/helpers'
import Scheduler from 'src/components/Scheduler/Scheduler'
// import SchedulerStore from 'src/components/Scheduler/scheduleStore'
import { Config, Event } from 'src/components/Scheduler/types'
import {
  createSchedulerStore,
  getTimeSlots,
  _generateEvent,
  SchedulerContext,
  // updateGeometries,
  // zStore,
} from 'src/components/Scheduler/zstore'

import 'bootstrap/dist/css/bootstrap.min.css'

// type SchedulerStore = ReturnType<typeof createSchedulerStore>

// export const SchedulerContext = createContext<SchedulerStore | null>(null)

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

// const pageStore = create((set) => ({
//   // votes: 0,
//   modalVisible: false,
//   showModal: () => set(() => ({ modalVisible: true })),
//   hideModal: () => set(() => ({ modalVisible: false })),
// }))

// function _showModal(state, props) {
//   return { modalVisible: true }
// }

// function _hideModal(state, props) {
//   return { modalVisible: false }
// }

const EventModal = (props) => {
  const event: Event = usePageStore((state) => state.currentEvent)
  const eventIndex: number = usePageStore((state) => state.currentEventIndex)

  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  // const store = getStore(SchedulerContext)

  let mode = 'passenger'

  if (event.data.class == 'driver') {
    mode = 'driver'
  }

  const config = useStore(store, (state) => state.config)
  const computed = useStore(store, (state) => state.computed)
  const _config = useStore(store, (state) => state.config)

  const updateEvent = useStore(store, (state) => state.updateEvent)

  const [start, setStart] = useState(event.start)

  function update() {
    event.start = start
    console.log('update', eventIndex, event)
    updateEvent(eventIndex, event)
    props.handleClose()
  }

  // TODO: save slots to pagestate
  const timeSlots = getTimeSlots(
    computed.tableStartTime,
    computed.tableEndTime,
    config.widthTime
  )

  const timeDivs = []

  for (let i = 0; i < timeSlots.length; i++) {
    const timeStr = formatTime(timeSlots[i])
    timeDivs.push(
      <option value={timeStr} key={i}>
        {timeStr}
      </option>
    )
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <input type="hidden" id="entryId" />
          <div className="row align-items-end pb-4">
            <div className="col-md-6">
              <label htmlFor="inputName" className="form-label">
                Name/label
              </label>
              <span
                className="ps-1"
                data-bs-toggle="tooltip"
                data-bs-title="Enter anything here (like nickname, or initials) so that you can identify your entry if you want to modify it later."
                data-bs-placement="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-info-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
              </span>
              <input
                type="text"
                className="form-control"
                id="inputName"
                defaultValue={event.text}
              />
            </div>

            <div
              className="col-md-6 btn-group h-25"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <div>
                <ToggleButtonGroup
                  type="radio"
                  name="options"
                  defaultValue={mode}
                >
                  <ToggleButton id="tbg-radio-1" value={'passenger'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>{' '}
                    Passenger
                  </ToggleButton>
                  <ToggleButton id="tbg-radio-2" value={'driver'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-car-front-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
                    </svg>{' '}
                    Driver
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                From
                <Form.Select
                  size="sm"
                  aria-label="choose start time"
                  defaultValue={event.start}
                  onChange={(e) => setStart(e.target.value)}
                >
                  {timeDivs}
                </Form.Select>
              </div>
              <div className="col-md-3">
                To
                <Form.Select
                  size="sm"
                  aria-label="choose end time"
                  defaultValue={event.end}
                >
                  {timeDivs}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Likelihood</Form.Label>
                <Form.Range defaultValue={event.data.likelihood} />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={update}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const Week = (props) => {
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
    onScheduleClick: function (time, colNum, rowNum) {
      console.log('onScheduleClick external method', time, colNum, rowNum)

      const startTime = computed.tableStartTime + colNum * config.widthTime
      const endTime = startTime + 4 * config.widthTime

      const randId = 0 + Math.floor(Math.random() * 1000)

      const event = {
        row: rowNum,
        start: formatTime(startTime),
        end: formatTime(endTime),
        text: 'new',
        data: {
          entry: randId,
          class: 'passenger',
          likelihood: 95,
        },
      }

      addEvent(event)
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
    // console.log('generated', newEvent)
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
  const config = useStore(store, (state) => state.config)
  const addEvent = useStore(store, (state) => state.addEvent)

  // mergeConfig(myConfig)

  const modalVisible = usePageStore((state) => state.modalVisible)
  const showModal = usePageStore((state) => state.showModal)
  const hideModal = usePageStore((state) => state.hideModal)
  const setEvent = usePageStore((state) => state.setEvent)

  let modal = <></>
  if (modalVisible === true) {
    modal = <EventModal show={modalVisible} handleClose={hideModal} />
  }

  // I could not figure out how to inject this from stories, so for now rand is initiated in this component
  let rand = <></>
  if (props.provideCreateRandom) {
    rand = (
      <Button variant="primary" onClick={addRandomEvent}>
        Create random event
      </Button>
    )
  }

  return (
    <>
      <SchedulerContext.Provider value={store}>
        {modal}

        <h1>Week!</h1>

        <Scheduler />

        {rand}

        {props.children}
      </SchedulerContext.Provider>
    </>
  )
}

export default Week
