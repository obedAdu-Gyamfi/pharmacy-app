
import Login from "./components/Login/Login";
import DashboardPage from "./components/Dashboard/DashboardPage";
import Dashboard from "./components/Dashboard/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Users } from "./components/Users/UsersPage";
import { CreateUser } from "./components/Users/CreateUser";
import { POS } from "./components/Sales/POS";
import { startTokenWatcher } from "./components/Login/StartTokenWatcher";
import { useEffect } from "react";
import { ProductsPage } from "./components/Products/ProductsPage";
import { CreateProduct } from "./components/Products/CreateProduct";
import { SupplierPage } from "./components/Suppliers/SupplierPage";
import { CreateSupplier } from "./components/Suppliers/CreateSupplier";
import { SalesPage } from "./components/Sales/SalesPage";

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
    {
      path: "/",
      element: <DashboardPage />,
      children: [
        {
          index: true, 
          element: <Dashboard />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "users",
          element: <Users />,
          children: [
            {
              path: "create-user",
              element: <CreateUser />,
            },
          ],
        },

        {
          path: "products",
          element: <ProductsPage />,
          children: [
            {
              path: "add",
              element: <CreateProduct />,
            },
          ],
        },
        {
          path: "sales",
          element: <SalesPage />,
          children:[
            {
              path: "pos",
              element: <POS />
            }
          ]
        },
      {
        path: "suppliers",
        element: <SupplierPage />,
        children:[
          {
            path: "add",
            element: <CreateSupplier />
          },
        ]

      },
      ],
    },
  ]);
  return (

   <RouterProvider router={router} />
  )
  
};

export default App;
