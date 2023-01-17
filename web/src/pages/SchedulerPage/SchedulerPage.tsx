import EventsCell from 'src/components/EventsCell'
import { getWeekSpan } from 'src/components/Scheduler/helpers'

const SchedulerPage = () => {
  // const after = '2023-01-16'
  // const before = '2023-01-20'

  const [after, before] = getWeekSpan()

  return <EventsCell before={before} after={after} locationId={1} />
}

export default SchedulerPage
