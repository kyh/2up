import React from "react";
import { ButtonV2 } from "~/components";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();
  console.log("router.pathname", router.pathname);
  return (
    <div className="flex justify-between pt-4 h-16 px-12">
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
      {router.pathname !== "/v2/lobby" && (
        <div className="flex  gap-4">
          <div>
            <ButtonV2
              className="text-3 border-spacing-0 font-mono"
              variant="link"
              size="small"
            >
              Login
            </ButtonV2>
          </div>
          <div>
            <ButtonV2 className="text-3 font-mono" variant="link" size="small">
              Create Account
            </ButtonV2>
          </div>
        </div>
      )}
    </div>
  );
};
