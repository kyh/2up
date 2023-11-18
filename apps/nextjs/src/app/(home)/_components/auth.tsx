import { auth, signIn, signOut } from "@2up/auth";

export const AuthShowcase = async () => {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("discord");
        }}
      >
        <button className="rounded-full bg-white/10 px-5 py-2 text-sm no-underline">
          Sign in with Discord
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="rounded-full bg-white/10 px-5 py-2 text-sm no-underline">
          Sign out
        </button>
      </form>
    </div>
  );
};
