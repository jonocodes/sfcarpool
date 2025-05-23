import { env } from 'process'

import { useState } from 'react'

import { Container, Form, Nav, Navbar, ToggleButton } from 'react-bootstrap'
import useDarkMode from 'use-dark-mode'

import { routes } from '@redwoodjs/router'
import { NavLink } from '@redwoodjs/router'

// import 'bootstrap/dist/css/bootstrap.min.css'

type SiteBootLayoutProps = {
  children?: React.ReactNode
}

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false)

  return (
    <>
      <Nav variant="pills" defaultActiveKey="light">
        <Nav.Item>
          <Nav.Link onClick={darkMode.disable} eventKey="light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-brightness-high-fill"
              viewBox="0 0 16 16"
            >
              <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
            </svg>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={darkMode.enable} eventKey="dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-moon"
              viewBox="0 0 16 16"
            >
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
            </svg>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {/* <Nav>
        <Nav.Item>
          <Form.Check
            type="switch"
            id="custom-switch"
            onChange={darkMode.toggle}
          />
        </Nav.Item>
      </Nav> */}
    </>
  )
}

const SiteBootLayout = ({ children }: SiteBootLayoutProps) => {
  const [isDark, setDark] = useState(false)

  const toggleDark = () => {
    setDark(!isDark)
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href={routes.scheduler()}>
            <img
              style={{
                marginRight: '5px',
              }}
              alt=""
              src="/icons8-carpool-ios-16-filled-96.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            San Francisco Carpool Coordinator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {/* <DarkModeToggle /> */}

              {/* <Nav>
                <Nav.Item>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    onChange={toggleDark}
                  />
                </Nav.Item>
              </Nav> */}

              <NavLink
                className="nav-link"
                activeClassName="active nav-link"
                to={routes.scheduler()}
              >
                View Schedule
              </NavLink>

              <NavLink
                className="nav-link"
                activeClassName="active nav-link"
                to={routes.about()}
              >
                About
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className={isDark ? 'dark-theme' : 'light-theme'}>
        <Container>{children}</Container>
      </main>
    </>
  )
}

export default SiteBootLayout
