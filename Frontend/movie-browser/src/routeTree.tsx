import { rootRoute } from "./routes/__root";
import { appLayoutRoute } from "./routes/_layout";
import { loginRoute, registerRoute } from "./routes/auth";
import { actorListRoute, actorDetailsRoute } from "./routes/actors";
import { indexRoute, styledRoute } from "./routes/general";

export const routeTree = rootRoute.addChildren([
  // Branch A: Pages with Navbar
  appLayoutRoute.addChildren([
    indexRoute,
    styledRoute,
    actorListRoute,
    actorDetailsRoute,
  ]),
  
  // Branch B: Pages without Navbar (Auth)
  loginRoute,
  registerRoute,
]);