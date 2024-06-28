import { PageHeader } from "@/components/header";
import { AdminDashboard } from "./_components/admin-dashboard";
import { AdminGuard } from "./_components/admin-guard";

const AdminPage = () => (
  <main className="flex flex-1 flex-col px-5">
    <PageHeader>Super Admin</PageHeader>
    <AdminDashboard />
  </main>
);

export default AdminGuard(AdminPage);
