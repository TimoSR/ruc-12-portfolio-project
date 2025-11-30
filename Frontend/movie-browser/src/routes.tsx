import { createRootRoute, createRoute } from "@tanstack/react-router";
import { HomePage } from "./pages/HomePage";
import { StyledComponentsDemo } from "./features/demoResearch/styledComponents/StyledComponentsDemo";

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
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