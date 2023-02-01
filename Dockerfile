ARG BASE_IMAGE=node:16.13.0-alpine
FROM ${BASE_IMAGE} as base

RUN mkdir /app
WORKDIR /app

# Required for building the web distributions
ENV NODE_ENV development

FROM base as dependencies

COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY package.json package.json
COPY web/package.json web/package.json
COPY yarn.lock yarn.lock

RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    --mount=type=cache,target=/root/.cache yarn install --immutable

COPY redwood.toml .
COPY graphql.config.js .

FROM dependencies as web_build

COPY web web
RUN yarn rw build web

FROM dependencies

ENV NODE_ENV production

COPY --from=web_build /app/web/dist /app/web/dist

COPY .fly .fly

ENTRYPOINT ["sh"]
CMD [".fly/start.sh"]
