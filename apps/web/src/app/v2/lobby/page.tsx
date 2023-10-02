import React, { ReactNode, useState } from "react";
import { TextField } from "../../components";

const Lobby = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex h-screen ">
        <div className="after:content[''] relative flex w-full items-start justify-center bg-dark-black bg-container before:absolute          before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10  before:bg-[url(/illustrations/bg.png)]  before:opacity-[0.05]">
          {" "}
          <div className="relative top-32 z-50 flex flex-col items-center space-y-4 ">
            <p className="text-center">
              Invite friends to truffles.tv<br></br> and enter room code
            </p>
            <TextField
              type={"text"}
              placeholder={"53298831"}
              className="text-3 h-10 text-center"
            ></TextField>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-40 flex w-full items-end gap-10 border-b-[36px] border-solid border-[#2A2A2A] pl-[157px] ">
          <div className="-mb-10 flex flex-col items-center">
            <p className="mb-4 cursor-pointer text-[14px] text-white hover:text-lg hover:text-accent-yellow-toned">
              Mickey
            </p>

            <img src="/illustrations/mickey.svg" alt="mickey"></img>
          </div>

          <div className="-mb-10 flex flex-col items-center">
            <p className="mb-4 cursor-pointer text-[14px] text-white hover:text-lg hover:text-accent-yellow-toned">
              Donald
            </p>

            <img src="/illustrations/donald.svg" alt="donald"></img>
          </div>

          <div className="-mb-10 flex flex-col items-center">
            <p className="mb-4 cursor-pointer text-[14px] text-white hover:text-lg hover:text-accent-yellow-toned">
              Goofy
            </p>

            <img src="/illustrations/goofy.svg" alt="goofy"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
