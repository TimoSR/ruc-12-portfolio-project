import { Outlet } from "@tanstack/react-router";
import { Navigation } from "../features/Tim/navigation";
import { createGlobalStyle } from "styled-components";

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