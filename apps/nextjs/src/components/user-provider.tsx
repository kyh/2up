"use client";

import type { ReactNode } from "react";
import { createContext, use, useContext, useEffect, useState } from "react";

import type { User } from "@init/api/auth/auth-schema";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export const UserProvider = ({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<{ user: User | null }>;
}) => {
  const data = use(userPromise);
  const [user, setUser] = useState<User | null>(data.user);

  useEffect(() => {
    setUser(data.user);
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
