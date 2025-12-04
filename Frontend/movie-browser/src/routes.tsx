import { createRootRoute, createRoute } from "@tanstack/react-router";
import { StyledComponentsDemo } from "./features/Tim/styledComponents/StyledComponentsDemo";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./pages/RootLayout";
import { MovieListPage } from "./pages/MovieListPage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";

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

export const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies',
  component: MovieListPage,
})

export const movieDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies/$movieId',
  component: MovieDetailsPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  styledRoute,
  moviesRoute,
  movieDetailsRoute,
]);