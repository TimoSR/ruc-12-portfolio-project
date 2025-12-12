import { rootRoute } from "./routes/__root";
import { appLayoutRoute } from "./routes/_layout";
import { loginRoute, registerRoute } from "./routes/auth";
import { personListRoute, personDetailsRoute } from "./routes/persons";
import { homeRoute } from "./routes/home";
import { styledRoute } from "./routes/styled";

export const routeTree = rootRoute.addChildren([
  // Branch A: Pages with Navbar
  appLayoutRoute.addChildren([
    homeRoute,
    styledRoute,
    personListRoute,
    personDetailsRoute,
  ]),
  
  // Branch B: Pages without Navbar (Auth)
  loginRoute,
  registerRoute,
]);