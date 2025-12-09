import Sidebar from "../Sidebar/Sidebar";
import Layout from "../../layouts/RootLayout";
import { Link, Outlet } from "react-router-dom";

export default function DashboardPage() {
  return (
    <>
      <Layout>
        <aside>
          <Link to="/dashboard" className="block text-blue-600">
          </Link>
          <Link to="/users" className="block text-blue-600">
          </Link>
          <Link to="/users/create-user" className="block text-blue-600">

          </Link>
        </aside>

        <main className="grid gap-4 pb-4 grid-cols-[220px_1fr] pt-4">
          <Sidebar />
          <Outlet />
        </main>
      </Layout>
    </>
  );
}
