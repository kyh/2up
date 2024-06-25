import { AdminSidebar } from "./_components/admin-sidebar";

export const metadata = {
  title: `Super Admin`,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      {children}
    </div>
  );
}
