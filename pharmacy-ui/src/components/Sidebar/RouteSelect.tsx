
import { type IconType } from 'react-icons';
import { FiHome, FiUser, FiShoppingCart, FiUserPlus } from 'react-icons/fi';
import { FcCustomerSupport, FcSalesPerformance } from 'react-icons/fc';
import { LuLogs } from 'react-icons/lu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const routes = [
  { title: "Dashboard", Icon: FiHome, path: "/dashboard" },

  {
    title: "Users",
    Icon: FiUser,
    children: [
      { title: "All Users", path: "/users" },
      { title: "Create User", path: "/users/create-user" },
    ],
  },

  {
    title: "Products",
    Icon: FiShoppingCart,
    children: [
      { title: "All Products", path: "/products" },
      { title: "Add Product", path: "/products/add" },
    ],
  },

  {
    title: "Suppliers",
    Icon: FiUserPlus,
    children: [
      { title: "All Suppliers", path: "/suppliers" },
      { title: "Add Supplier", path: "/suppliers/add" },
    ],
  },

  {
    title: "Sales",
    Icon: FcSalesPerformance,
    children: [
      { title: "Sales Dashboard", path: "/sales" },
      { title: "POS", path: "/sales/pos" },
    ],
  },

  {
    title: "Customers",
    Icon: FcCustomerSupport,
    children: [
      { title: "All Customers", path: "/customers" },
      { title: "Add Customer", path: "/customers/add" },
    ],
  },

  { title: "View Audit Logs", Icon: LuLogs, path: "/audit-logs" },
];


export const RouteSelect = () => {
  const [selected, setSelected] = useState("Dashboard");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="space-y-1">
      {routes.map((route) => (
        <RouteItem
          key={route.title}
          route={route}
          selected={selected}
          setSelected={setSelected}
          openMenu={openMenu}
          toggleMenu={toggleMenu}
        />
      ))}
    </div>
  );
};


interface RouteProps {
  route: any;
  selected: string;
  setSelected: (val: string) => void;
  openMenu: string | null;
  toggleMenu: (val: string) => void;
}

const RouteItem = ({
  route,
  selected,
  setSelected,
  openMenu,
  toggleMenu,
}: RouteProps) => {
  const hasChildren = route.children && route.children.length > 0;
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            toggleMenu(route.title);
          } else {
            setSelected(route.title);
            if (route.path) navigate(route.path); // <-- navigate here
          }
        }}
        className={`flex items-center justify-between w-full px-2 py-1.5 rounded text-sm
          transition ${
            selected === route.title
              ? "bg-white text-stone-950 shadow"
              : "hover:bg-stone-200 text-stone-500"
          }`}
      >
        <div className="flex items-center gap-2">
          <route.Icon
            className={selected === route.title ? "text-violet-500" : ""}
          />
          <span>{route.title}</span>
        </div>

        {hasChildren && (
          <span className="text-xs">
            {openMenu === route.title ? "▲" : "▼"}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {hasChildren && openMenu === route.title && (
        <div className="ml-8 mt-1 space-y-1">
          {route.children.map((child: any) => (
            <button
              key={child.title}
              onClick={() => {
                setSelected(child.title);
                if (child.path) navigate(child.path); // <-- navigate here
              }}
              className={`block w-full text-left text-sm px-2 py-1 rounded
                ${
                  selected === child.title
                    ? "bg-violet-100 text-violet-700"
                    : "text-stone-500 hover:bg-stone-200"
                }`}
            >
              {child.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

