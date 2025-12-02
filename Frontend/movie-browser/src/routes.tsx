import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Home } from "./components/Home";
import { StyledComponentsDemo } from "./components/StyledComponentsDemo";
import {RegisterPage} from "./components/register"
export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// Styled Components Route
export const styledRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/styled',
    component: StyledComponentsDemo,
})


// Regsiter Components route
export const RegisterRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: RegisterPage,
})

export const routeTree = rootRoute.addChildren([
    indexRoute,
    styledRoute,
    RegisterRoute,
]);