import { Link } from "react-router-dom";
import Layout from "../../layouts/RootLayout";
import { SalesStartCard } from "./SalesStartCard";

export const POS = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0b1220] px-6 pb-8 pt-6 text-slate-100">
        <div className="mx-auto w-full max-w-6xl">
          <Link to="/sales" className="block text-sm text-slate-400">
            Back to Sales
          </Link>
          <div className="mt-4 grid gap-4">
            <SalesStartCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};
