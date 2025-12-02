import { createRootRoute, createRoute } from "@tanstack/react-router";
import { StyledComponentsDemo } from "./features/Tim/styledComponents/StyledComponentsDemo";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./pages/RootLayout";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

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