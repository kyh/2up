import React from "react";
import { Button, Card, SideBar } from "../../../components";

const CategoryData = [
  {
    name: "Gamename01",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/cone.png",
  },
  {
    name: "Gamename02",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/burger.png",
  },
  {
    name: "Gamename03",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/shake.png",
  },
  {
    name: "Gamename04",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/donut.png",
  },
  {
    name: "Gamename05",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/tacu.png",
  },
  {
    name: "Gamename06",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/pizza.png",
  },
];

const Category = () => {
  return (
    <div className="flex flex-col">
      <div className="flex h-screen">
        <SideBar />

        <div className="backgroundImage after:content[''] before:h-vh container relative flex h-full w-full flex-col overflow-y-auto px-11 pb-11 pt-20 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0  before:bg-[url(/illustrations/bg.png)] before:opacity-[0.05]">
          {" "}
          <div className="relative z-40 flex flex-col">
            <div className="text-3 borderCustom-2 mb-12 cursor-pointer font-sans text-gray-400">
              Back
            </div>
            <h2 className="mb-8 w-96 font-mono text-2xl text-white">Food</h2>
            <div className="-mx-6 flex flex-wrap">
              {CategoryData?.map((x) => {
                return (
                  <div className="w-1/2 p-6">
                    <Card className="px-6 py-9">
                      <div className="flex gap-10">
                        <div>
                          <Card className="flex h-52 w-52 content-center items-center border-gray-950 bg-gray-950 text-center">
                            <img className="mx-auto" src={x.url}></img>
                          </Card>
                        </div>
                        <div className="flex flex-col">
                          <div className="mb-2 flex content-between items-center">
                            <h4 className="text-4 mt-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono font-bold text-white">
                              {x.name}
                            </h4>
                            <img
                              className="ml-auto"
                              src="/illustrations/vector.png"
                            ></img>
                          </div>
                          <p className="text-4 m-0 font-sans font-normal text-gray-400">
                            {x.discription}
                          </p>

                          <p className="text-4  m-0 font-sans font-normal text-gray-400">
                            Created: xx.xx.xx
                          </p>

                          <Button
                            className="mb-0 mt-auto h-14 font-mono opacity-50"
                            variant="secondary"
                            size="small"
                          >
                            PLAY
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
