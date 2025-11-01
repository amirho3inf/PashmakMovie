import { createBrowserRouter } from "react-router";
import Test from "./test";
import Root from "./root";
import Landing from "./pages/landing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        path: "/",
        Component: Landing,
      },
      {
        path: "/search",
        Component: Test,
      },
    ],
    //   loader: loadRootData,
  },
]);
