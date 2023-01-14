import { Router, Route, Set } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

// import SiteLayout from 'src/layouts/SiteLayout'
import SiteBootLayout from './layouts/SiteBootLayout/SiteBootLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Locations" titleTo="locations" buttonLabel="New Location" buttonTo="newLocation">
        <Route path="/admin/locations/new" page={LocationNewLocationPage} name="newLocation" />
        <Route path="/admin/locations/{id:Int}/edit" page={LocationEditLocationPage} name="editLocation" />
        <Route path="/admin/locations/{id:Int}" page={LocationLocationPage} name="location" />
        <Route path="/admin/locations" page={LocationLocationsPage} name="locations" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Events" titleTo="events" buttonLabel="New Event" buttonTo="newEvent">
        <Route path="/admin/events/new" page={EventNewEventPage} name="newEvent" />
        <Route path="/admin/events/{id:Int}/edit" page={EventEditEventPage} name="editEvent" />
        <Route path="/admin/events/{id:Int}" page={EventEventPage} name="event" />
        <Route path="/admin/events" page={EventEventsPage} name="events" />
      </Set>
      <Route path="/scheduler2" page={SchedulerPage} name="scheduler" />
      <Set wrap={SiteBootLayout}>
        <Route path="/scheduler" page={SchedulerPage} name="scheduler" />
        <Route path="/update" page={UpdatePage} name="update" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
