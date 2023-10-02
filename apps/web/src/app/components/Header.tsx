"use client";
import React from "react";
import { Button } from "./Button";
import { usePathname } from "next/navigation";

const showHeaderActions = (pathname: string) => {
  const lobby = "/v2/lobby";
  const getready = "/v2/lobby/getready";

  if (pathname !== lobby && pathname !== getready) {
    return true;
  }
  return false;
};

export const Header = () => {
  const pathname = usePathname();
  const renderActions = showHeaderActions(pathname as string);

  return (
    <div className="flex h-16 justify-between px-12 pt-4">
      <div>
        <img
          alt="2up"
          loading="lazy"
          width="30"
          height="35"
          decoding="async"
          data-nimg="1"
          src="/logo/logomark.svg"
        ></img>
      </div>

      {renderActions && (
        <div className="flex  gap-4">
          <div>
            <Button
              className="text-3 border-spacing-0 font-mono"
              variant="link"
              size="small"
            >
              Login
            </Button>
          </div>
          <div>
            <Button className="text-3 font-mono" variant="link" size="small">
              Create Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
