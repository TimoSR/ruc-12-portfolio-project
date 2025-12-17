import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./_layout";
import { BookmarksPage } from "../pages/BookmarksPage";

export const bookmarksRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: "/bookmarks",
    component: BookmarksPage,
});
