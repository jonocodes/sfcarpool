import { useState } from "react";

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
} from "react-bootstrap";

import { Event } from "~/utils/models";

import { calcStringTime, formatTime } from "../components/Scheduler/helpers";

import "bootstrap/dist/css/bootstrap.min.css";
import toast from "react-hot-toast";
import { modifyEvent, softDeleteEvent } from "~/utils/db";

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
);

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
);

const EventModal = (props: {
  show: boolean;
  currentEvent: Event;
  handleClose: () => void;
  removeEvent: (index: number) => void;
  updateEvent: (index: number, event: Event) => void;
  startDate: Date;
  locationId: number;
  eventIndex: number;
  timeSlots: number[];
}) => {
  const [currentEvent] = useState(props.currentEvent);

  const origEvent = structuredClone(currentEvent);

  const [likelihood] = useState(currentEvent.data.likelihood);

  const [validated, setValidated] = useState(true);

  const [timespanError, setTimespanError] = useState("");

  async function updateEvent(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    console.log("update", props.eventIndex, currentEvent);

    await modifyEvent(currentEvent, props.locationId);

    props.handleClose();

    return false;
  }

  async function removeEvent() {
    console.log("remove", props.eventIndex, currentEvent);

    try {
      await softDeleteEvent(currentEvent);

      props.removeEvent(props.eventIndex);
      props.handleClose();
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  }

  const timeDivs = [];

  for (let i = 0; i < props.timeSlots.length; i++) {
    const timeStr = formatTime(props.timeSlots[i]);
    timeDivs.push(
      <option value={timeStr} key={i}>
        {timeStr}
      </option>
    );
  }

  function validateTimespan() {
    if (calcStringTime(currentEvent.end) <= calcStringTime(currentEvent.start)) {
      // console.log('timespan invalid')
      setTimespanError("invalid time span");
      setValidated(false);
    } else {
      // console.log('timespan vaild')
      setTimespanError("");
      setValidated(true);
    }
  }

  function cancelAndClose() {
    props.updateEvent(props.eventIndex, origEvent);
    console.log("cancel rolling back to", origEvent);
    props.handleClose();
  }

  return (
    <Modal show={props.show} onHide={cancelAndClose} centered>
      <Form noValidate>
        <Modal.Header closeButton>
          <Modal.Title>
            {/* TODO: localize day of week */}
            {currentEvent.data.date.toLocaleDateString("en-US", { weekday: "long" })}{" "}
            {currentEvent.data.date.toLocaleDateString()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="dark-theme" fluid>
            <Row className="align-items-end pb-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    style={{
                      paddingRight: "5px",
                    }}
                  >
                    Label
                  </Form.Label>
                  <OverlayTrigger
                    delay={{ hide: 350, show: 100 }}
                    overlay={(props) => (
                      <Tooltip {...props}>
                        Enter anything here (like nickname, or initials) so you can identify your
                        entry in case you want to modify it later.
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
                    defaultValue={currentEvent.text}
                    onChange={(e) => (currentEvent.text = e.target.value)}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="h-25">
                <ToggleButtonGroup
                  type="radio"
                  name="options"
                  defaultValue={currentEvent.data.mode}
                >
                  <ToggleButton
                    id="tbg-radio-1"
                    value={"passenger"}
                    // variant={'outline-primary'}
                    variant={"outline-success"}
                    onChange={(e) => (currentEvent.data.mode = e.target.value)}
                  >
                    {icon_passenger} Passenger
                  </ToggleButton>
                  <ToggleButton
                    id="tbg-radio-2"
                    value={"driver"}
                    // variant={'outline-danger'}
                    variant={"outline-warning"}
                    onChange={(e) => (currentEvent.data.mode = e.target.value)}
                  >
                    {icon_driver} Driver
                  </ToggleButton>
                </ToggleButtonGroup>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>From</Form.Label>

                  <Form.Select
                    size="sm"
                    aria-label="choose start time"
                    defaultValue={currentEvent.start}
                    onChange={(e) => {
                      currentEvent.start = e.target.value;
                      validateTimespan();
                    }}
                  >
                    {timeDivs}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>To</Form.Label>

                  <Form.Select
                    size="sm"
                    aria-label="choose end time"
                    defaultValue={currentEvent.end}
                    onChange={(e) => {
                      currentEvent.end = e.target.value;
                      validateTimespan();
                    }}
                  >
                    {timeDivs}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Likelihood {likelihood}%</Form.Label>
                  <Form.Range
                    defaultValue={likelihood}
                    onChange={(e) => {
                      currentEvent.data.likelihood = Number(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="error">{timespanError}</Col>
            </Row>
            {/* </Row> */}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col xs={6} md={8}>
                <Button variant="danger" onClick={removeEvent}>
                  Delete
                </Button>
              </Col>

              <Col xs={3} md={2}>
                <Button className="float-end" variant="secondary" onClick={cancelAndClose}>
                  Close
                </Button>
              </Col>
              <Col xs={3} md={2}>
                <Button
                  className="float-end"
                  variant="primary"
                  type="submit"
                  onClick={updateEvent}
                  disabled={!validated}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EventModal;
