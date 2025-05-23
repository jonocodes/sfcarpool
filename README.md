# SF Carpool Coordinator

This is an experimental web app to help initiate carpools to San Fancisco during the morning commute.

## Screenshot
![screenshot](screenshot.png?raw=true "screenshot")

## Features
* Live updates (GraphQL subscription)
* No-code backend (Hasura)
* Storybook preview
* Audit logging

## Prerequisites
- [Node.js](https://nodejs.org/en/) 20
- docker with compose
- gnu make

## TODO
* fix storybook. it broke when upgrading to redwood 8 with vite.
* replace Makefile with Taskfile

## Development setup

Start the backend. Run Hasura backed by Postgres:
```
make api
```

If this is the first time setting up the db:
* setup connection
* run migrations
* track tables
* set permissions
```
TBD...
```

In a new terminal start the development server:

```
make setup web
```

You may see a bunch of prisma errors, but we are not using prisma, so you can ignore them.

Visit
http://localhost:8910


For additional common commands run:
```
make help
```
