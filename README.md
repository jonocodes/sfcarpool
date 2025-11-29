# SF Carpool Coordinator

This is an experimental web app to help initiate carpools to San Francisco during the morning commute.

## Screenshot

![screenshot](screenshot.png?raw=true "screenshot")

## Features

- Local first offline PWA using triplit db
- Storybook preview


## Prerequisites

- [Node.js](https://nodejs.org/en/) 20
- Just

## Development setup

Start the backend. Run tirplit:

```
just setup be
```

In a new terminal start the development server:

```
just fe
```

You may see a bunch of prisma errors, but we are not using prisma, so you can ignore them.

Visit
http://localhost:3000

For additional common commands run:

```
just
```

## Prod DB Setup

First deploy triplit to a remote location. I use docker.

Now seed it.

(example uses fish shell)
```
set -x JWT_SECRET "xxxx"

set -x TRIPLIT_TOKEN "yyyy"

set -x TRIPLIT_REMOTE "https://zzzz"

npx triplit schema push --token=$TRIPLIT_TOKEN --remote=$TRIPLIT_REMOTE

npx triplit seed run --all --token=$TRIPLIT_TOKEN --remote=$TRIPLIT_REMOTE
```

To run the local frontend against the remote db

```
just fe-prod
```
