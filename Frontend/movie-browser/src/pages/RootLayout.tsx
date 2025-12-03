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
    /* This reserves space for the scrollbar always, preventing the shift */
    scrollbar-gutter: stable;
  }
`