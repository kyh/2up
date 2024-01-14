export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development")
    return `http://localhost:${process.env.PORT ?? 3000}`;

  return process.env.NEXT_PUBLIC_HOST ?? process.env.VERCEL_URL;
};

export const createRedirectUrl = (redirectTo: string, current: string) => {
  return `${getBaseUrl()}${redirectTo}?redirect=${current}`;
};

export const createTeamInviteUrl = ({
  code,
  email,
}: {
  code: string;
  email: string;
}) => {
  return `${getBaseUrl()}/auth/join?code=${encodeURIComponent(
    code,
  )}&email=${encodeURIComponent(email)}`;
};
