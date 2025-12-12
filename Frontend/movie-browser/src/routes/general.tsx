import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout"; // Import Parent
import { HomePage } from "../pages/HomePage";
import { StyledComponentsDemo } from "../features/Tim/styledComponents/StyledComponentsDemo";

export const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: HomePage,
});

export const styledRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/styled',
  component: StyledComponentsDemo,
});