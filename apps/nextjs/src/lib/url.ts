export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
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
