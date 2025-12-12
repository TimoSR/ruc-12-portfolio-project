import { createRootRouteWithContext, createRoute, Outlet } from "@tanstack/react-router";
import { StyledComponentsDemo } from "./features/Tim/styledComponents/StyledComponentsDemo";
import { HomePage } from "./pages/HomePage";
import { RootLayout } from "./pages/RootLayout";
import { ActorListPage } from "./pages/ActorListPage";
import { ActorDetailsPage } from "./pages/ActorDetailsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from "@tanstack/react-query";
import { actorListQueryOptions } from "./api/queries/actorQueries";

interface MyRouterContext {
  queryClient: QueryClient
}

// ✅ FIX: Renamed from 'Route' to 'rootRoute' so references below work
export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {/* Tip: Only render DevTools in development */}
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  ),
});

// THE APP LAYOUT (Pathless Route)
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute, // This now matches the variable above
  id: '_layout', 
  component: RootLayout,
});

// --- MAIN APP ROUTES ---

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

// 1. Define the TypeScript type manually
// (Since we don't have Zod to infer it for us)
type ActorSearch = {
  query: string;
  page: number;
  pageSize: number;
};

export const actorListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/actors',

  // 2. Manual Validation & Transformation
  // 'search' comes in as Record<string, unknown>
  validateSearch: (search: Record<string, unknown>): ActorSearch => {
    return {
      // Handle 'query': default to empty string if missing
      query: (search.query as string) || '',
      
      // Handle 'page': Convert to Number, fallback to 1 if missing or invalid
      page: Number(search.page) || 1,
      
      // Handle 'pageSize': Convert to Number, fallback to 20
      pageSize: Number(search.pageSize) || 20,
    };
  },

  // 3. loaderDeps receives the CLEAN object returned above
  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps: searchParams }) => {
    return queryClient.ensureQueryData(actorListQueryOptions(searchParams));
  },

  component: ActorListPage,
});

export const actorDetailsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/actors/$actorId',
  component: ActorDetailsPage,
});

// --- AUTH ROUTES ---

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute, // Correctly bypasses appLayoutRoute
  path: '/login',
  component: LoginPage,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
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
  
  // Branch B: Pages without Navbar (Auth)
  loginRoute,
  registerRoute,
]);