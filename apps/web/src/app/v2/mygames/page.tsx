import React, { ReactNode, useState } from "react";
import { SideBar } from "../../components";
import { HomeLayoutV2 } from "~/lib/home/HomeLayoutV2";

const MyGames = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex h-screen ">
        <SideBar />
        <div className="after:content[''] relative flex w-full items-start justify-center bg-dark-black bg-container before:absolute          before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10  before:bg-[url(/illustrations/bg.png)]  before:opacity-[0.05]">
          {" "}
          <p className="mt-48">My Games</p>
        </div>
      </div>
    </div>
  );
};
const getLayout = (page: ReactNode) => <HomeLayoutV2>{page}</HomeLayoutV2>;

MyGames.getLayout = getLayout;

export default MyGames;
