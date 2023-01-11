import EventsCell from 'src/components/EventsCell'

const SchedulerPage = () => {
  const after = '2023-01-09'
  const before = '2023-01-13'

  return <EventsCell before={before} after={after} locationId={1} />
}

export default SchedulerPage
