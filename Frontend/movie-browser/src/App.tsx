import { createRouter, RouterProvider } from "@tanstack/react-router";
import { indexRoute, rootRoute } from "./routes";

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({
  routeTree,
});

// This MUST exist only once in the entire project:
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App