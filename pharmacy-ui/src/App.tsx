
import Login from "./components/Login/Login";
import DashboardPage from "./components/Dashboard/DashboardPage";
import Dashboard from "./components/Dashboard/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Users } from "./components/Users/UsersPage";
import { CreateUser } from "./components/Users/CreateUser";
import { POS } from "./components/Sales/POS";
import { startTokenWatcher } from "./components/Login/StartTokenWatcher";
import { useEffect } from "react";

const App = () => {

  useEffect(() => {
    startTokenWatcher();
  }, []);

  const router = createBrowserRouter([
    // PUBLIC ROUTES
    {
      path: "/login",
      element: <Login />,
    },

    // PROTECTED ROUTES (all under Sidebar)
    {
      path: "/",
      element: <DashboardPage />, // Sidebar layout
      children: [
        {
          index: true, // default route -> Dashboard
          element: <Dashboard />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "users/create-user",
          element: <CreateUser />,
        },
      ],
    },
    {
      path: "sales",
      element: <POS />,
    },
  ]);
  return (

   <RouterProvider router={router} />
  )
  
};

export default App;
