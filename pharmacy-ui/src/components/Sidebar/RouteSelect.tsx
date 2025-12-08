
import { type IconType } from 'react-icons';
import { FiHome, FiUser, FiShoppingCart, FiUserPlus } from 'react-icons/fi';
import { FcCustomerSupport, FcSalesPerformance } from 'react-icons/fc';
import { LuLogs } from 'react-icons/lu';
import { useState } from 'react';



const routes = [
  { title: "Dashboard", Icon: FiHome },

  {
    title: "Users",
    Icon: FiUser,
    children: [{ title: "All Users" }, { title: "Create User" }],
  },

  {
    title: "Products",
    Icon: FiShoppingCart,
    children: [{ title: "All Products" }, { title: "Add Product" }],
  },

  {
    title: "Suppliers",
    Icon: FiUserPlus,
    children: [{ title: "All Suppliers" }, { title: "Add Supplier" }],
  },

  {
    title: "Sales",
    Icon: FcSalesPerformance,
    children: [{ title: "Sales Dashboard" }, { title: "POS" }],
  },

  {
    title: "Customers",
    Icon: FcCustomerSupport,
    children: [{ title: "All Customers" }, { title: "Add Customer" }],
  },

  { title: "View Audit Logs", Icon: LuLogs },
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

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) toggleMenu(route.title);
          else setSelected(route.title);
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
              onClick={() => setSelected(child.title)}
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
