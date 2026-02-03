import Sidebar from "../Sidebar/Sidebar";
import Layout from "../../layouts/RootLayout";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded?.role;
      if (role !== "admin" && role !== "manager") {
        navigate("/pos");
      }
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

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
