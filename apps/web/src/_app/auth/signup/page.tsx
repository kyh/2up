import { AuthForm } from "../components/auth-form";

export default function SignupPage() {
  return (
    <section className="max-w-xs translate-y-[-70px]">
      <h1 className="mb-5 text-center text-4xl font-bold">Sign Up</h1>
      <AuthForm />
    </section>
  );
}
