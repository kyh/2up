import { Header } from "../components";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed z-50 w-screen">
        <Header />
      </div>
      {children}
    </>
  );
}
