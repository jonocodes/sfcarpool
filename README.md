# SF Carpool Coordinator

This is an experimental web app to help initiate carpools to San Fancisco during the morning commute.

> **Prerequisites**
>
> - Redwood requires [Node.js](https://nodejs.org/en/) (>=14.19.x <=16.x) and [Yarn](https://yarnpkg.com/) (>=1.15)
> - docker with compose

Start by installing dependencies:

```
yarn install
```

Start the backend. Run Hasura backed by Postgres:
```
cd hasura
docker compose up -d
```

If this is the first time setting up the db:
* setup connection
* run migrations
* track tables
* set permissions
```
TBD...
```

To start the development server:

```
yarn redwood dev web
```

To start the storybook for front end development:

```
yarn rw storybook
```
