import Dashboard from "./Dashboard";
import Sidebar from "../Sidebar/Sidebar";
import Layout from "../../layouts/RootLayout";

export default function DashboardPage() {
  return (
    <Layout>
      <main className="grid gap-4 pb-4 grid-cols-[220px_1fr] pt-4">
        <Sidebar />
        <Dashboard />
      </main>
    </Layout>
  );
}
