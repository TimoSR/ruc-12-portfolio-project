import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  ),
});