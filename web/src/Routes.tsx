import { Router, Route, Set } from '@redwoodjs/router'

import SiteLayout from 'src/layouts/SiteLayout'

const Routes = () => {
  return (
    <Router>
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
