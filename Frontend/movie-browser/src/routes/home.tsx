import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout"; // Import Parent
import { HomePage } from "../pages/HomePage";

export const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: HomePage,
});