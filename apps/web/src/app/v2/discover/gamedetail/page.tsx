import React from "react";
import { Button, Card, SideBar } from "../../../components";

const GetReady = () => {
  return (
    <div className="flex flex-col">
      <div className="flex h-screen">
        <SideBar />

        <div className="backgroundImage after:content[''] container relative flex w-full flex-col items-center justify-center bg-dark-black before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10  before:bg-[url(/illustrations/bg.png)] before:opacity-[0.05]">
          {" "}
          <div className="relative z-40 flex flex-col px-20">
            <div className="text-3 mb-12 cursor-pointer font-sans text-gray-400">
              Back
            </div>
            <div className="flex gap-16">
              <div>
                <Card className="h-64 w-64" background="blue-regular">
                  <img
                    className="mx-auto"
                    src="/illustrations/christmas.png"
                  ></img>
                </Card>
              </div>

              <div className="flex flex-col">
                <article className="prose-h2 text-6 mb-3 font-mono text-white">
                  Christmas pack
                </article>
                <article className="text-4 prose-sm font-sans text-gray-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eu turpis molestie, dictum est a, mattis tellus. Sed
                  dignissim, metus nec fringilla accumsan, risus sem
                  sollicitudin lacus, ut interdum tellus elit sed risus.
                  Maecenas eget condimentum velit,
                </article>

                <Button className="mb-0 mt-auto" variant="primary" size="small">
                  Start The Game
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetReady;
