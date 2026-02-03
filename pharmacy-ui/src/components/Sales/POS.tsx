import { Link } from "react-router-dom";
import Layout from "../../layouts/RootLayout";
import { SalesStartCard } from "./SalesStartCard";

export const POS = () => {
  return (
    <div className="grid gap-4 bg-[#0b1220] px-4 pb-6 pt-6 text-slate-100 shadow-inner">
      <Link to="/sales" className="block text-blue-600"></Link>
      <SalesStartCard />
    </div>
  );
};
