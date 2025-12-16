import { createRoute } from "@tanstack/react-router";
import { RootLayout } from "../pages/RootLayout";
import { rootRoute } from "./__root";

export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute, 
  id: '_layout', 
  component: RootLayout,
});