import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
// import appCss from "~/styles/app.css?url";
// import indexCss from "~/styles/index.css?url";
// import { seo } from "~/utils/seo";

// import { JazzReactProvider } from "jazz-tools/react";
// import { CarpoolAccount } from "~/jazzSchema";

// const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

import { Container, Form, Nav, Navbar, ToggleButton } from "react-bootstrap";
import { JazzWrapper } from "~/components/JazzWrapper";

const isDark = false;

export const Route = createRootRoute({
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href={"/scheduler"}>
            <img
              style={{
                marginRight: "5px",
              }}
              alt=""
              src="/icons8-carpool-ios-16-filled-96.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            San Francisco Carpool Coordinator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Link
                className="nav-link"
                activeProps={{
                  className: "font-bold",
                }}
                // activeClassName="active nav-link"
                to={"/scheduler"}
              >
                View Schedule
              </Link>

              <Link
                className="nav-link"
                activeProps={{
                  className: "font-bold",
                }}
                // activeClassName="active nav-link"
                to={"/about"}
              >
                About
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className={isDark ? "dark-theme" : "light-theme"}>
        <JazzWrapper>
          <Container>{children}</Container>
        </JazzWrapper>
        <TanStackRouterDevtools position="bottom-right" />
        {/* <Scripts /> */}
      </main>
    </>
  );
}
