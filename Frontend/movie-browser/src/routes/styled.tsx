import { createRoute } from "@tanstack/react-router";
import { StyledComponentsDemo } from "../features/Tim/styledComponents/StyledComponentsDemo";
import { appLayoutRoute } from "./_layout";

export const styledRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/styled',
  component: StyledComponentsDemo,
});