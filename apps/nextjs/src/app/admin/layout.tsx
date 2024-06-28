import { AdminSidebar } from "./_components/admin-sidebar";

export const metadata = {
  title: `Super Admin`,
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-dvh">
    <AdminSidebar />
    {children}
  </div>
);

export default AdminLayout;
