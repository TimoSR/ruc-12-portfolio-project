// src/routes/general.tsx
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_app"; // Import Parent
import { HomePage } from "../pages/HomePage";
import { StyledComponentsDemo } from "../features/Tim/styledComponents/StyledComponentsDemo";

// --- Route 1: Home (Index) ---
export const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: HomePage,
});

// --- Route 2: Styled Demo ---
export const styledRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/styled',
  component: StyledComponentsDemo,
});