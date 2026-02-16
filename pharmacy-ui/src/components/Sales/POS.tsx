import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layouts/RootLayout";
import { SalesStartCard } from "./SalesStartCard";
import { logout } from "../Login/auth";
import { jwtDecode } from "jwt-decode";

export const POS = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let showNav = false;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded?.role;
      showNav = role === "admin" || role === "manager";
    } catch (err) {
      showNav = false;
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#00008B] px-6 pb-8 pt-6 text-slate-100">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {showNav && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                >
                  <span className="text-base text-white">
                    ← Back to Dashboard
                  </span>
                </Link>
              )}
              <h1 className="text-xl font-semibold text-white">POS</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-700 px-4 py-1.5 text-sm text-white hover:bg-slate-600"
            >
              Logout
            </button>
          </div>
          <div className="mt-4 grid gap-4">
            <SalesStartCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};
