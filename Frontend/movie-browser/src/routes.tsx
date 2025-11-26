import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Home } from "./components/Home";
import { StyledComponentsDemo } from "./components/StyledComponentsDemo";

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

export const routeTree = rootRoute.addChildren([
    indexRoute,
    styledRoute,
]);