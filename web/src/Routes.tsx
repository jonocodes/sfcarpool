import { Router, Route, Set } from '@redwoodjs/router'

import SiteBootLayout from 'src/layouts/SiteBootLayout/SiteBootLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={SiteBootLayout}>
        <Route path="/" page={SchedulerPage} name="scheduler" />
        <Route path="/about" page={AboutPage} name="about" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
