import { createRootRoute, createRoute } from "@tanstack/react-router";
import { StyledComponentsDemo } from "./features/Tim/styledComponents/StyledComponentsDemo";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./pages/RootLayout";
import { RegisterPage } from "./pages/RegisterPage";

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

// Styled Components Route
export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  styledRoute,
  registerRoute
]);