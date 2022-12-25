import { useContext, useRef, useState } from 'react'
import { createContext } from 'react'

import { Button, Modal } from 'react-bootstrap'
import { useStore } from 'zustand'
import create from 'zustand'

import { formatTime } from 'src/components/Scheduler/helpers'
import Scheduler from 'src/components/Scheduler/Scheduler'
// import SchedulerStore from 'src/components/Scheduler/scheduleStore'
import { Event } from 'src/components/Scheduler/types'
import {
  createSchedulerStore,
  getTimeSlots,
  setup,
  // updateGeometries,
  // zStore,
} from 'src/components/Scheduler/zstore'

type SchedulerStore = ReturnType<typeof createSchedulerStore>

export const SchedulerContext = createContext<SchedulerStore | null>(null)

interface PageState {
  modalVisible: boolean
  currentEvent: Event
  showModal: () => void
  hideModal: () => void
  setEvent: (event: Event) => void
  // increase: (by: number) => void
}

const usePageStore = create<PageState>()((set) => ({
  modalVisible: false,
  currentEvent: null,
  showModal: () => set(() => ({ modalVisible: true })),
  hideModal: () => set(() => ({ modalVisible: false })),
  setEvent: (event) => set(() => ({ currentEvent: event })),
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

const rows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const data = [
  {
    row: 0, // monday
    start: '8:00',
    end: '8:10',
    text: 'JK',
    data: {
      entry: 8,
      class: 'passenger',
      likelihood: 20,
    },
  },
  {
    row: 1, //tuesday
    start: '6:30',
    end: '7:10',
    text: 'Jono',
    data: {
      entry: 4,
      class: 'passenger',
      likelihood: 95,
    },
  },
  {
    row: 1, // tuesday
    start: '7:05',
    end: '7:30',
    text: 'Jodi',
    data: {
      entry: 5,
      class: 'driver',
      likelihood: 70,
    },
  },
  {
    row: 1, // tuesday
    start: '7:40',
    end: '8:50',
    text: 'Jono',
    data: {
      entry: 9,
      class: 'passenger',
      likelihood: 70,
    },
  },
  {
    row: 4, // friday
    start: '8:40',
    end: '8:50',
    text: 'Jono',
    data: {
      entry: 10,
      class: 'passenger',
      likelihood: 70,
    },
  },
]

// function setupStore(data, rows, config) {
//   // const initStore = zStore((state) => state.init)

//   const s = setup(data, rows, config)

//   // const ug = zStore((state) => state.updateGeometries)

//   updateGeometries()

//   // initStore(data, rows, config)

//   // // const init2 = zStore((state) => state.init2)
//   // const init3 = zStore((state) => state.init3)

//   // // init2()
//   // init3()
// }

const EventModalBasic = (props) => {
  // const [show, setShow] = useState(true)

  // console.log('SModal ', show)

  // const handleClose = () => setShow(false)
  // const handleShow = () => setShow(true)

  const event: Event = usePageStore((state) => state.currentEvent)

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal headingh {event.text} </Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, youre reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={props.handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const EventModal = (props) => {
  const event: Event = usePageStore((state) => state.currentEvent)

  const store = useContext(SchedulerContext)
  if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  // const store = getStore(SchedulerContext)

  const config = useStore(store, (state) => state.config)
  const computed = useStore(store, (state) => state.computed)
  const _config = useStore(store, (state) => state.config)

  // TODO: save slots to pagestate
  const timeSlots = getTimeSlots(
    computed.tableStartTime,
    computed.tableEndTime,
    config.widthTime
  )

  const timeDivs = []

  for (let i = 0; i < timeSlots.length; i++) {
    const timeStr = formatTime(timeSlots[i])
    timeDivs.push(<option value="{timeStr}">{timeStr}</option>)
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Event {event.text} </Modal.Title>
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
                value="arrrr"
              />
            </div>

            <div
              className="col-md-6 btn-group h-25"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="radiosMode"
                id="buttonPassenger"
                autoComplete="off"
                checked
              />
              <div>
                <label
                  className="btn btn-outline-primary"
                  htmlFor="buttonPassenger"
                >
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
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="radiosMode"
                  id="buttonDriver"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="buttonDriver"
                >
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
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                From
                <select
                  className="form-select form-select-sm"
                  aria-label="choose start time"
                  id="selectStart"
                >
                  {timeDivs}
                </select>
              </div>
              <div className="col-md-3">
                To
                <select
                  className="form-select form-select-sm"
                  aria-label="choose end time"
                  id="selectEnd"
                >
                  {timeDivs}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="customRange1" className="form-label">
                  Likelihood <span id="likelihood"></span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="likelihoodSlider"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={props.handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const SchedulerPage = () => {
  // setupStore(data, rows, config)

  // const initStore = zStore((state) => state.init)
  // initStore(data, rows, config)

  // // const init2 = zStore((state) => state.init2)
  // const init3 = zStore((state) => state.init3)

  // // init2()
  // init3()

  const config = {
    startTime: '06:00', // schedule start time(HH:ii)
    endTime: '10:00', // schedule end time(HH:ii)
    widthTime: 60 * 5,
    timeLineY: 60, // height(px)
    dataWidth: 120,
    verticalScrollbar: 20, // scrollbar (px)
    timeLineBorder: 2, // border(top and bottom)
    bundleMoveWidth: 6, // width to move all schedules to the right of the clicked time line cell
    // draggable: isDraggable,
    // resizable: isResizable,
    resizableLeft: true,
    widthTimeX: 20,
    onClick: function (event, rowNum) {
      console.log('onScheduleClick external method', event, rowNum)

      showModal()
      setEvent(event)

      // const modalVisible = usePageStore((state) => state.modalVisible)
      // const showModal = usePageStore((state) => state.showModal)
      // const hideModal = usePageStore((state) => state.hideModal)
      // document.getElementById('exampleModal')
    },
  }

  const store = useRef(
    createSchedulerStore({ rows: rows, events: data, config: config })
  ).current

  const modalVisible = usePageStore((state) => state.modalVisible)
  const showModal = usePageStore((state) => state.showModal)
  const hideModal = usePageStore((state) => state.hideModal)
  const setEvent = usePageStore((state) => state.setEvent)

  // const [show, setShow] = useState(false)
  // const handleClose = () => setShow(false)
  // const handleShow = () => setShow(true)

  // const store = useContext(SchedulerContext)
  // if (!store) throw new Error('Missing SchedulerContext.Provider in the tree')

  // const computed = useStore(store, (state) => state.computed)

  // const _config = useStore(store, (state) => state.config)

  // const timeSlots = getTimeSlots(
  //   computed.tableStartTime,
  //   computed.tableEndTime,
  //   _config.widthTime
  // )

  // const timeDivs = []

  // for (let i = 0; i < timeSlots.length; i++) {
  //   const timeStr = formatTime(timeSlots[i])
  //   timeDivs.push(<option value="{timeStr}">{timeStr}</option>)
  // }

  let modal

  if (modalVisible === true) {
    modal = <EventModal show={modalVisible} handleClose={hideModal} />
    // modal = (
    //   <Modal show={show} onHide={handleClose}>
    //     <Modal.Header closeButton>
    //       <Modal.Title>Update Event</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <div className="container-fluid">
    //         <input type="hidden" id="entryId" />
    //         <div className="row align-items-end pb-4">
    //           <div className="col-md-6">
    //             <label htmlFor="inputName" className="form-label">
    //               Name/label
    //             </label>
    //             <span
    //               className="ps-1"
    //               data-bs-toggle="tooltip"
    //               data-bs-title="Enter anything here (like nickname, or initials) so that you can identify your entry if you want to modify it later."
    //               data-bs-placement="top"
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="12"
    //                 height="12"
    //                 fill="currentColor"
    //                 className="bi bi-info-circle-fill"
    //                 viewBox="0 0 16 16"
    //               >
    //                 <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    //               </svg>
    //             </span>
    //             <input
    //               type="text"
    //               className="form-control"
    //               id="inputName"
    //               value="arrrr"
    //             />
    //           </div>

    //           <div
    //             className="col-md-6 btn-group h-25"
    //             role="group"
    //             aria-label="Basic radio toggle button group"
    //           >
    //             <input
    //               type="radio"
    //               className="btn-check"
    //               name="radiosMode"
    //               id="buttonPassenger"
    //               autoComplete="off"
    //               checked
    //             />
    //             <div>
    //               <label
    //                 className="btn btn-outline-primary"
    //                 htmlFor="buttonPassenger"
    //               >
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   width="16"
    //                   height="16"
    //                   fill="currentColor"
    //                   className="bi bi-person-fill"
    //                   viewBox="0 0 16 16"
    //                 >
    //                   <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    //                 </svg>{' '}
    //                 Passenger
    //               </label>

    //               <input
    //                 type="radio"
    //                 className="btn-check"
    //                 name="radiosMode"
    //                 id="buttonDriver"
    //                 autoComplete="off"
    //               />
    //               <label
    //                 className="btn btn-outline-primary"
    //                 htmlFor="buttonDriver"
    //               >
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   width="16"
    //                   height="16"
    //                   fill="currentColor"
    //                   className="bi bi-car-front-fill"
    //                   viewBox="0 0 16 16"
    //                 >
    //                   <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
    //                 </svg>{' '}
    //                 Driver
    //               </label>
    //             </div>
    //           </div>

    //           <div className="row">
    //             <div className="col-md-3">
    //               From
    //               <select
    //                 className="form-select form-select-sm"
    //                 aria-label="choose start time"
    //                 id="selectStart"
    //               >
    //                 {timeDivs}
    //               </select>
    //             </div>
    //             <div className="col-md-3">
    //               To
    //               <select
    //                 className="form-select form-select-sm"
    //                 aria-label="choose end time"
    //                 id="selectEnd"
    //               >
    //                 {timeDivs}
    //               </select>
    //             </div>

    //             <div className="col-md-6">
    //               <label htmlFor="customRange1" className="form-label">
    //                 Likelihood <span id="likelihood"></span>
    //               </label>
    //               <input
    //                 type="range"
    //                 className="form-range"
    //                 id="likelihoodSlider"
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose}>
    //         Close
    //       </Button>
    //       <Button variant="primary" onClick={handleClose}>
    //         Save Changes
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    // )
  } else {
    modal = <></>
  }

  return (
    <SchedulerContext.Provider value={store}>
      <Button variant="primary" onClick={showModal}>
        Launch demo modal
      </Button>

      {modal}

      <h1>SchedulerPage</h1>

      <Scheduler />
    </SchedulerContext.Provider>
  )
}

export default SchedulerPage
