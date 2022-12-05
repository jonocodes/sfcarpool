import { NavLink, Link, routes } from '@redwoodjs/router'

type SiteLayoutProps = {
  children?: React.ReactNode
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <>
      <header>
        <h1>
          <Link to={routes.home()}>San Francisco Carpool Coordinator</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <NavLink activeClassName="active" to={routes.home()}>
                View Schedule
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to={routes.update()}>
                Update Schedule
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to={routes.about()}>
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default SiteLayout
