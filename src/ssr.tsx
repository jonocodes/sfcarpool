/// <reference types="vinxi/types/server" />

// TODO: disable SSR since it makes dev tricky. https://github.com/TanStack/router/discussions/3264
// deleting this file does not work.

import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
