import { AuthForm } from "../components/auth-form";

export default function LoginPage() {
  return (
    <section className="max-w-xs translate-y-[-70px]">
      <h1 className="mb-5 text-center text-4xl font-bold">Login</h1>
      <AuthForm isLogin />
    </section>
  );
}
