# SF Carpool Coordinator

This is an experimental web app to help initiate carpools to San Francisco during the morning commute.

REWRITE IN PROGRESS: moving from redwood/hasura to tanstack/electric

## Screenshot

![screenshot](screenshot.png?raw=true "screenshot")

## Features

<!-- * Live updates (GraphQL subscription)
* No-code backend (Hasura) -->

- Storybook preview
<!-- * Audit logging -->

## Prerequisites

- [Node.js](https://nodejs.org/en/) 20
- docker with compose
- Just

## Development setup

Start the backend. Run Hasura backed by Postgres:

```
just be
```

If this is the first time setting up the db:

- setup connection
- run migrations
- track tables
- set permissions

```
TBD...
```

In a new terminal start the development server:

```
just setup fe
```

You may see a bunch of prisma errors, but we are not using prisma, so you can ignore them.

Visit
http://localhost:3000

For additional common commands run:

```
just
```
