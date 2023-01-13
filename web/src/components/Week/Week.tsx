import { useContext, useRef, useState } from 'react'

import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from 'react-bootstrap'
import {
  CreateEventMutation,
  CreateEventMutationVariables,
  DeleteEventMutation,
  DeleteEventMutationVariables,
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'
import { useStore } from 'zustand'
import create from 'zustand'

import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/dist/toast'

import {
  // eventToGql,
  eventToGql,
  formatTime,
} from 'src/components/Scheduler/helpers'
import Scheduler from 'src/components/Scheduler/Scheduler'
import { Config, Event } from 'src/components/Scheduler/types'
import {
  createSchedulerStore,
  getTimeSlots,
  _generateEvent,
  SchedulerContext,
} from 'src/components/Scheduler/zstore'

import 'bootstrap/dist/css/bootstrap.min.css'

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

const icon_passenger = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-person-fill"
    viewBox="0 0 16 16"
  >
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
)

const icon_driver = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-car-front-fill"
    viewBox="0 0 16 16"
  >
    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
  </svg>
)

const CREATE_EVENT = gql`
  mutation CreateEventMutation($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`

const UPDATE_EVENT = gql`
  mutation UpdateEventMutation($id: Int!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
    }
  }
`

const DELETE_EVENT = gql`
  mutation DeleteEventMutation($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`

const EventModal = (props) => {
  const _event: Event = usePageStore((state) => state.currentEvent)
  const eventIndex: number = usePageStore((state) => state.currentEventIndex)

  // const store = props.store
  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  // const store = getStore(SchedulerContext)

  const config = useStore(store, (state) => state.config)
  const computed = useStore(store, (state) => state.computed)
  // const _config = useStore(store, (state) => state.config)

  const _updateEvent = useStore(store, (state) => state.updateEvent)
  const _removeEvent = useStore(store, (state) => state.removeEvent)

  const [event, _] = useState(_event)

  const [likelihood, setLikelihood] = useState(event.data.likelihood)

  const [update, { loading, error }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    // onCompleted: (a) => {
    //   console.log(a)
    //   toast.success('Thank you for your submission!')
    // },
  })

  const [_delete] = useMutation<
    DeleteEventMutation,
    DeleteEventMutationVariables
  >(DELETE_EVENT, {
    // onCompleted: (a) => {
    //   console.log(a)
    //   toast.success('Thank you for your submission!')
    // },
  })

  async function updateEvent() {
    console.log('update', eventIndex, event)

    const gql_data = eventToGql(event, props.startDate)
    console.log('gql data', gql_data)

    // const resp = await
    update({
      variables: { id: Number(event.data.entry), input: gql_data },
    })
      .then(function () {
        _updateEvent(eventIndex, event)
      })
      .catch(function (error) {
        toast.error('there was a problem saving the event')
        console.log(error)
      })

    // console.log(resp)
    // TODO: what if db update fails?

    props.handleClose()
  }

  async function removeEvent() {
    _delete({ variables: { id: Number(event.data.entry) } })
      .then(function () {
        // TODO: put this here so data does not get out of sync.
        //    or figure out how to update the db from the store.
        // _removeEvent(eventIndex)
      })
      .catch(function (error) {
        toast.error('there was a problem deleting the event')
        console.log(error)
      })

    _removeEvent(eventIndex)

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
        <Container fluid>
          <Row className="align-items-end pb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  style={{
                    paddingRight: '5px',
                  }}
                >
                  Label
                </Form.Label>
                <OverlayTrigger
                  delay={{ hide: 350, show: 100 }}
                  overlay={(props) => (
                    <Tooltip {...props}>
                      Enter anything here (like nickname, or initials) such that
                      you can identify your entry in case you want to modify it
                      later.
                    </Tooltip>
                  )}
                  placement="bottom"
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
                </OverlayTrigger>
                <Form.Control
                  size="sm"
                  type="text"
                  defaultValue={event.text}
                  onChange={(e) => (event.text = e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="h-25">
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={event.data.mode}
              >
                <ToggleButton
                  id="tbg-radio-1"
                  value={'passenger'}
                  onChange={(e) => (event.data.mode = e.target.value)}
                >
                  {icon_passenger} Passenger
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-2"
                  value={'driver'}
                  onChange={(e) => (event.data.mode = e.target.value)}
                >
                  {icon_driver} Driver
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>

            <Row>
              <Col md={3}>
                From
                <Form.Select
                  size="sm"
                  aria-label="choose start time"
                  defaultValue={event.start}
                  onChange={(e) => (event.start = e.target.value)}
                >
                  {timeDivs}
                </Form.Select>
              </Col>
              <Col md={3}>
                To
                <Form.Select
                  size="sm"
                  aria-label="choose end time"
                  defaultValue={event.end}
                  onChange={(e) => (event.end = e.target.value)}
                >
                  {timeDivs}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Likelihood %{likelihood}</Form.Label>
                <Form.Range
                  defaultValue={likelihood}
                  onChange={(e) => {
                    event.data.likelihood = e.target.value
                    setLikelihood(e.target.value)
                  }}
                />
              </Col>
            </Row>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            <Button variant="secondary" onClick={removeEvent}>
              Delete
            </Button>
          </Col>

          <Col md="auto">
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
          </Col>
          <Col md="auto">
            <Button variant="primary" onClick={updateEvent}>
              Save Changes
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  )
}

const Week = (props) => {
  const [create, { loading, error }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CREATE_EVENT, {
    // onCompleted: (a) => {
    //   console.log(a)
    //   toast.success('Thank you for your submission!')
    // },
  })

  const [update, { loading2, error2 }] = useMutation<
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

    onChange: async function (event, eventIndex) {
      const gql_data = eventToGql(event, startDate)

      const resp = update({
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

  let modal = <></>
  if (modalVisible === true) {
    modal = (
      <EventModal
        show={modalVisible}
        handleClose={hideModal}
        store={store}
        startDate={startDate}
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
