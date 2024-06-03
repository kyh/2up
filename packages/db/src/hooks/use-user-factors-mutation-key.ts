export const useFactorsMutationKey = (userId: string) => [
  "mfa-factors",
  userId,
];
