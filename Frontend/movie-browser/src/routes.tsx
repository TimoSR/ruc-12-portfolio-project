import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { HomePage } from "./pages/HomePage";
import { StyledComponentsDemo } from "./features/demoResearch/styledComponents/StyledComponentsDemo";
import { Navigation } from "./features/navigation";

function RootLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}

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