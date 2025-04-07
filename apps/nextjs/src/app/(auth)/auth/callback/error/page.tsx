import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@kyh/ui/button";

type PageProps = {
  searchParams: Promise<{
    error: string;
    invite_token: string;
  }>;
};

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const { error, invite_token } = searchParams;
  const queryParam = invite_token ? `?invite_token=${invite_token}` : "";
  const signInPath = "/auth/sign-in" + queryParam;

  // if there is no error, redirect the user to the sign-in page
  if (!error) {
    redirect(signInPath);
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1>
        An error occurred: <strong>{error}</strong>
      </h1>
      <Button variant="link" asChild>
        <Link href={signInPath}>Go back</Link>
      </Button>
    </div>
  );
};

export default Page;
