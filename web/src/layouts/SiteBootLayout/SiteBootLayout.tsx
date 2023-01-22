import { Container, Nav, Navbar } from 'react-bootstrap'

import { routes } from '@redwoodjs/router'
import { NavLink } from '@redwoodjs/router'

// import 'bootstrap/dist/css/bootstrap.min.css'

type SiteBootLayoutProps = {
  children?: React.ReactNode
}

const SiteBootLayout = ({ children }: SiteBootLayoutProps) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href={routes.scheduler()}>
            San Francisco Carpool Coordinator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {/* <Nav.Link href={routes.scheduler()}>Schedule</Nav.Link>
              <Nav.Link href={routes.about()}>About</Nav.Link> */}

              <NavLink
                className="nav-link"
                activeClassName="active"
                to={routes.scheduler()}
              >
                View Schedule
              </NavLink>

              <NavLink
                className="nav-link"
                activeClassName="active"
                to={routes.about()}
              >
                About
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <header>
        <h1>
          <Link to={routes.home()}>San Francisco Carpool Coordinator</Link>
        </h1>
      </header> */}
      <main>
        <Container>{children}</Container>
      </main>
    </>
  )
}

export default SiteBootLayout
