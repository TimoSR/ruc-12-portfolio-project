import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { HomePage } from "./pages/HomePage";
import { NavbarSection } from "./features/chris/navbar";
import { StyledComponentsDemo } from "./features/tim/styledComponents/StyledComponentsDemo";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <NavbarSection />
      <Outlet />
    </>
  ),
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