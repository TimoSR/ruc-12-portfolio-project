import { Outlet } from "@tanstack/react-router";
import { createGlobalStyle } from "styled-components";
import { NavigationWithSearch } from "../features/Tim/navigation";
import { observer } from "mobx-react";

export const RootLayout = observer(() => {

  return (
    <>
        <GlobalScrollbarFix />
        <NavigationWithSearch />
        <Outlet />
    </>
  )
})

const GlobalScrollbarFix = createGlobalStyle`
  html {
    /* This forces the scrollbar UI to be visible 100% of the time */
    overflow-y: auto;
  }
`