import { auth, signIn, signOut } from "@acme/auth";

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
        <button>Sign in with Discord</button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button>Sign out ({session.user?.name})</button>
    </form>
  );
};
