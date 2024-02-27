export const createTeamInviteUrl = ({
  baseUrl,
  code,
  email,
}: {
  baseUrl: string;
  code: string;
  email: string;
}) => {
  return `${baseUrl}/auth/join?code=${encodeURIComponent(
    code,
  )}&email=${encodeURIComponent(email)}`;
};
