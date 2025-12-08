import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { StyledComponentsDemo } from "./features/Tim/styledComponents/StyledComponentsDemo";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./pages/RootLayout";
import { ActorListPage } from "./pages/ActorListPage";
import { ActorDetailsPage } from "./pages/ActorDetailsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

// 1. THE INVISIBLE ROOT
// This is now just an empty shell that renders whatever comes next.
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 2. THE APP LAYOUT (Pathless Route)
// This holds your Navbar/Sidebar.
// We use 'id' instead of 'path' so it doesn't change the URL.
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_layout', 
  component: RootLayout,
});

// --- MAIN APP ROUTES (Children of appLayoutRoute) ---

export const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute, // Changed parent
  path: "/",
  component: HomePage,
});

export const styledRoute = createRoute({
  getParentRoute: () => appLayoutRoute, // Changed parent
  path: '/styled',
  component: StyledComponentsDemo,
});

export const actorListRoute = createRoute({
  getParentRoute: () => appLayoutRoute, // Changed parent
  path: '/actors',
  component: ActorListPage,
});

export const actorDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute, // Changed parent
  path: '/actors/$actorId',
  component: ActorDetailsPage,
});

// --- AUTH ROUTES (Children of rootRoute) ---
// These bypass the AppLayout, so no Navbar.

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute, // Stays Root
  path: '/login',
  component: LoginPage,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute, // Stays Root
  path: '/register',
  component: RegisterPage,
});

// 3. THE TREE
export const routeTree = rootRoute.addChildren([
  // Branch A: Pages with Navbar
  appLayoutRoute.addChildren([
    indexRoute,
    styledRoute,
    actorListRoute,
    actorDetailsRoute,
  ]),
  
  // Branch B: Pages without Navbar
  loginRoute,
  registerRoute,
]);