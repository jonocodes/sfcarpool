import { Router, Route, Set } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import SiteLayout from 'src/layouts/SiteLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Locations" titleTo="locations" buttonLabel="New Location" buttonTo="newLocation">
        <Route path="/locations/new" page={LocationNewLocationPage} name="newLocation" />
        <Route path="/locations/{id:Int}/edit" page={LocationEditLocationPage} name="editLocation" />
        <Route path="/locations/{id:Int}" page={LocationLocationPage} name="location" />
        <Route path="/locations" page={LocationLocationsPage} name="locations" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Events" titleTo="events" buttonLabel="New Event" buttonTo="newEvent">
        <Route path="/events/new" page={EventNewEventPage} name="newEvent" />
        <Route path="/events/{id:Int}/edit" page={EventEditEventPage} name="editEvent" />
        <Route path="/events/{id:Int}" page={EventEventPage} name="event" />
        <Route path="/events" page={EventEventsPage} name="events" />
      </Set>
      <Route path="/scheduler" page={SchedulerPage} name="scheduler" />
      <Set wrap={SiteLayout}>
        <Route path="/update" page={UpdatePage} name="update" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
