// import type { ComponentStory } from "@storybook/react-vite";

// import { Loading, Empty, Failure, Success } from '../components/EventsCell'
// import { standard } from "./EventsCell.mock";
import EventsCell from "../components/EventsCell";
import { Config } from "../components/Scheduler/types";
// import { parseDateTime } from "../components/Scheduler/helpers";
import { LocalDate, LocalTime } from "@js-joda/core";

// export const loading = () => {
//   return Loading ? <Loading /> : <></>
// }

// export const empty = () => {
//   return Empty ? <Empty /> : <></>
// }

// export const failure: ComponentStory<typeof Failure> = (args) => {
//   return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
// }

// export const success: ComponentStory<typeof Success> = (args) => {
//   return Success ? <Success {...standard()} {...args} /> : <></>;
// };

export const events = () => {
  const after = LocalDate.parse("2023-01-09");
  const before = LocalDate.parse("2023-01-13");

  const myConfig: Config = {
    startTime: LocalTime.parse("6:00"),
    endTime: LocalTime.parse("9:00"),
  };

  return <EventsCell before={before} after={after} locationId={"2"} />;
};

export default { title: "Cells/EventsCell" };
