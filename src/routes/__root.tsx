import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
// import appCss from "~/styles/app.css?url";
import indexCss from "~/styles/index.css?url";
import { seo } from "~/utils/seo";

import { Container, Form, Nav, Navbar, ToggleButton } from "react-bootstrap";
// import { routes } from "vinxi/dist/types/lib/plugins/routes";

const isDark = false;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "SF Carpool | Scheduler",
        description: `A place to show your carpooling availability`,
      }),
    ],
    links: [
      // { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: indexCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
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
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand href={"/scheduler"}>
                <img
                  style={{
                    marginRight: "5px",
                  }}
                  alt=""
                  src="/android-chrome-192x192.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{" "}
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
            <Container>{children}</Container>

            <TanStackRouterDevtools position="bottom-right" />
            <Scripts />
          </main>
        </>

        {/* <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/scheduler"
            activeProps={{
              className: "font-bold",
            }}
          >
            Scheduler
          </Link>{" "}
          <Link
            to="/about"
            activeProps={{
              className: "font-bold",
            }}
          >
            About
          </Link>{" "}
        </div>
        <hr />
        {children}
        */}
      </body>
    </html>
  );
}
