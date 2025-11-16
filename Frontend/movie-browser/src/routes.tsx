import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Root } from "./components/root";

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Root,
});