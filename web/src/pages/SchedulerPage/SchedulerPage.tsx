import { useRef, useState } from 'react'
import { createContext } from 'react'

import { Button, Modal } from 'react-bootstrap'

import Scheduler from 'src/components/Scheduler/Scheduler'
// import SchedulerStore from 'src/components/Scheduler/scheduleStore'
import {
  createSchedulerStore,
  setup,
  updateGeometries,
  zStore,
} from 'src/components/Scheduler/zstore'

type SchedulerStore = ReturnType<typeof createSchedulerStore>

export const SchedulerContext = createContext<SchedulerStore | null>(null)

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
    document.getElementById('exampleModal')
  },
}

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

function setupStore(data, rows, config) {
  // const initStore = zStore((state) => state.init)

  const s = setup(data, rows, config)

  // const ug = zStore((state) => state.updateGeometries)

  updateGeometries()

  // initStore(data, rows, config)

  // // const init2 = zStore((state) => state.init2)
  // const init3 = zStore((state) => state.init3)

  // // init2()
  // init3()
}

const SchedulerPage = () => {
  // setupStore(data, rows, config)

  // const initStore = zStore((state) => state.init)
  // initStore(data, rows, config)

  // // const init2 = zStore((state) => state.init2)
  // const init3 = zStore((state) => state.init3)

  // // init2()
  // init3()

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const store = useRef(
    createSchedulerStore({ rows: rows, events: data, config: config })
  ).current

  return (
    <SchedulerContext.Provider
      value={store}
      // events={data}
      // rows={rows}
      // config={config}
    >
      {/* <div className="modal" id="exampleModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update event
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
                        <option value="6:00">6:00</option>
                        <option value="6:05">6:05</option>
                        <option value="6:10">6:10</option>
                        <option value="6:15">6:15</option>
                        <option value="6:20">6:20</option>
                        <option value="6:25">6:25</option>
                        <option value="6:30">6:30</option>
                        <option value="6:35">6:35</option>
                        <option value="6:40">6:40</option>
                        <option value="6:45">6:45</option>
                        <option value="6:50">6:50</option>
                        <option value="6:55">6:55</option>
                        <option value="7:00">7:00</option>
                        <option value="7:05">7:05</option>
                        <option value="7:10">7:10</option>
                        <option value="7:15">7:15</option>
                        <option value="7:20">7:20</option>
                        <option value="7:25">7:25</option>
                        <option value="7:30">7:30</option>
                        <option value="7:35">7:35</option>
                        <option value="7:40">7:40</option>
                        <option value="7:45">7:45</option>
                        <option value="7:50">7:50</option>
                        <option value="7:55">7:55</option>
                        <option value="8:00">8:00</option>
                        <option value="8:05">8:05</option>
                        <option value="8:10">8:10</option>
                        <option value="8:15">8:15</option>
                        <option value="8:20">8:20</option>
                        <option value="8:25">8:25</option>
                        <option value="8:30">8:30</option>
                        <option value="8:35">8:35</option>
                        <option value="8:40">8:40</option>
                        <option value="8:45">8:45</option>
                        <option value="8:50">8:50</option>
                        <option value="8:55">8:55</option>
                        <option value="9:00">9:00</option>
                        <option value="9:05">9:05</option>
                        <option value="9:10">9:10</option>
                        <option value="9:15">9:15</option>
                        <option value="9:20">9:20</option>
                        <option value="9:25">9:25</option>
                        <option value="9:30">9:30</option>
                        <option value="9:35">9:35</option>
                        <option value="9:40">9:40</option>
                        <option value="9:45">9:45</option>
                        <option value="9:50">9:50</option>
                        <option value="9:55">9:55</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      To
                      <select
                        className="form-select form-select-sm"
                        aria-label="choose end time"
                        id="selectEnd"
                      >
                        <option value="6:00">6:00</option>
                        <option value="6:05">6:05</option>
                        <option value="6:10">6:10</option>
                        <option value="6:15">6:15</option>
                        <option value="6:20">6:20</option>
                        <option value="6:25">6:25</option>
                        <option value="6:30">6:30</option>
                        <option value="6:35">6:35</option>
                        <option value="6:40">6:40</option>
                        <option value="6:45">6:45</option>
                        <option value="6:50">6:50</option>
                        <option value="6:55">6:55</option>
                        <option value="7:00">7:00</option>
                        <option value="7:05">7:05</option>
                        <option value="7:10">7:10</option>
                        <option value="7:15">7:15</option>
                        <option value="7:20">7:20</option>
                        <option value="7:25">7:25</option>
                        <option value="7:30">7:30</option>
                        <option value="7:35">7:35</option>
                        <option value="7:40">7:40</option>
                        <option value="7:45">7:45</option>
                        <option value="7:50">7:50</option>
                        <option value="7:55">7:55</option>
                        <option value="8:00">8:00</option>
                        <option value="8:05">8:05</option>
                        <option value="8:10">8:10</option>
                        <option value="8:15">8:15</option>
                        <option value="8:20">8:20</option>
                        <option value="8:25">8:25</option>
                        <option value="8:30">8:30</option>
                        <option value="8:35">8:35</option>
                        <option value="8:40">8:40</option>
                        <option value="8:45">8:45</option>
                        <option value="8:50">8:50</option>
                        <option value="8:55">8:55</option>
                        <option value="9:00">9:00</option>
                        <option value="9:05">9:05</option>
                        <option value="9:10">9:10</option>
                        <option value="9:15">9:15</option>
                        <option value="9:20">9:20</option>
                        <option value="9:25">9:25</option>
                        <option value="9:30">9:30</option>
                        <option value="9:35">9:35</option>
                        <option value="9:40">9:40</option>
                        <option value="9:45">9:45</option>
                        <option value="9:50">9:50</option>
                        <option value="9:55">9:55</option>
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  id="buttonDelete"
                  data-bs-dismiss="modal"
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="buttonSave"
                  data-bs-dismiss="modal"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, youre reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <h1>SchedulerPage</h1>

      <Scheduler />

      <Button>hi</Button>
    </SchedulerContext.Provider>
  )
}

export default SchedulerPage
