import React, { ReactNode } from "react";
import { HomeLayoutV2 } from "~/lib/home/HomeLayoutV2";

const GetReady = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex h-screen ">
        <div className="flex items-start justify-center w-full bg-container bg-dark-black after:content[''] before:left-0 before:top-0          before:right-0 before:bottom-0 before:absolute before:z-10 before:opacity-[0.05]  before:bg-[url(/illustrations/bg.png)]  relative">
          <div className="relative mt-48 flex flex-col gap-8 items-center content-center z-40">
            <div className="flex gap-6">
              <img className="mx-auto" src="/illustrations/front.png"></img>
              <img className="mx-auto" src="/illustrations/back.png"></img>
              <img className="mx-auto" src="/illustrations/front.png"></img>
            </div>
            <p className="text-center font-mono text-4 font-bold text-4">
              Game start in
            </p>
            <p className="text-center text-accent-yellow-regular text-5 font-mono">
              5s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
const getLayout = (page: ReactNode) => <HomeLayoutV2>{page}</HomeLayoutV2>;

GetReady.getLayout = getLayout;

export default GetReady;
