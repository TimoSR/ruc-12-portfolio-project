import { Outlet } from "@tanstack/react-router";
import { createGlobalStyle } from "styled-components";
import { Navigation } from "../features/Tim/navigation";

export function RootLayout() {
  return (
    <>
        <GlobalScrollbarFix />
        <Navigation />
        <Outlet />
    </>
  )
}

const GlobalScrollbarFix = createGlobalStyle`
  html {
    /* This forces the scrollbar UI to be visible 100% of the time */
    overflow-y: auto;
  }
`