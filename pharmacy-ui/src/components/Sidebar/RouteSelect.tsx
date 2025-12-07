
import { type IconType } from 'react-icons';
import { FiHome, FiUser, FiShoppingCart, FiUserPlus } from 'react-icons/fi';
import { FcCustomerSupport, FcSalesPerformance } from 'react-icons/fc';
import { LuLogs } from 'react-icons/lu';
import { useState } from 'react';

interface Props {
  selected: boolean;
  Icon: IconType;
  title: string;
  onSelectItem: (item: string) => void
}
export const RouteSelect = () => {
  return (
    (() => {
      const [selected, setSelected] = useState('Dashboard');

      return (
        <div className="space-y-1">
          <Route Icon={FiHome} selected={selected === 'Dashboard'} title="Dashboard" onSelectItem={setSelected} />
          <Route Icon={FiUser} selected={selected === 'Users'} title="Users" onSelectItem={setSelected} />
          <Route Icon={FiShoppingCart} selected={selected === 'Products'} title="Products" onSelectItem={setSelected} />
          <Route Icon={FiUserPlus} selected={selected === 'Suppliers'} title="Suppliers" onSelectItem={setSelected} />
          <Route Icon={FcSalesPerformance} selected={selected === 'Sales'} title="Sales" onSelectItem={setSelected} />
          <Route Icon={FcCustomerSupport} selected={selected === 'Customers'} title="Customers" onSelectItem={setSelected} />
          <Route Icon={LuLogs} selected={selected === 'View Audit Logs'} title="View Audit Logs" onSelectItem={setSelected} />
        </div>
      );
    })()
  );
};


const Route = ({selected, Icon, title, onSelectItem}: Props) => {
  return ( 
  <button
  onClick={() => onSelectItem(title)}
  className={`flex items-center justify-start gap-2 w-full
    rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
      selected
      ? "bg-white text-stone-950 shadow"
      : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
    }`}
  >
    <Icon className={selected ? "text-violet-500" : ""}/>
    <span>{title}</span>
  </button>
  )
}
