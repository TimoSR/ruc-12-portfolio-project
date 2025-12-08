import { createRootRoute, createRoute } from "@tanstack/react-router";
import { StyledComponentsDemo } from "./features/Tim/styledComponents/StyledComponentsDemo";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./pages/RootLayout";
import { ActorListPage } from "./pages/ActorListPage";
import { ActorDetailsPage } from "./pages/ActorDetailsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

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

// Actor Routes
export const actorListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/actors',
  component: ActorListPage,
})

export const actorDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/actors/$actorId',
  component: ActorDetailsPage,
})

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,  
  path: '/login',
  component: LoginPage,
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
  actorListRoute,
  actorDetailsRoute,
  registerRoute,
  loginRoute,
]);