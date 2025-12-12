// src/routes/routeTree.ts
import { indexRoute, styledRoute } from "../routes";
import { rootRoute } from "./__root";
import { appLayoutRoute } from "./_app";
import { actorListRoute, actorDetailsRoute } from "./actors";
import { loginRoute, registerRoute } from "./auth";

export const routeTree = rootRoute.addChildren([
  // Branch A: The App Layout
  appLayoutRoute.addChildren([
    indexRoute,
    styledRoute,
    actorListRoute,
    actorDetailsRoute,
  ]),

  // Branch B: Auth (Direct children of root)
  loginRoute,
  registerRoute,
]);