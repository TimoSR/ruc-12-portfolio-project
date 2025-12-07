import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Home } from "./components/Home";
import { StyledComponentsDemo } from "./components/StyledComponentsDemo";
import {RegisterPage} from "./feature/register";
import { LoginPage } from "./feature/login";
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

//Login Components route
export const LoginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
})

export const routeTree = rootRoute.addChildren([
    indexRoute,
    styledRoute,
    RegisterRoute,
    LoginRoute,
]);