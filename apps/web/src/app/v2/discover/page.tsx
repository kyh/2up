import React from "react";
import { Button, TextField, Card, SideBar } from "../../components";

const featutred = [
  { name: "Games", url: "/illustrations/game.png" },
  { name: "Heartcare", url: "/illustrations/heart.png" },
  { name: "Battels", url: "/illustrations/battle.png" },
  { name: "Food", url: "/illustrations/food.png" },
  { name: "Chemistry", url: "/illustrations/bottle.png" },
  { name: "History", url: "/illustrations/history.png" },
];
const hotData = [
  {
    name: "Christmas pack",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/christmas.png",
    color: "blue-regular",
  },
  {
    name: "Agriculture and other staff",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/agriculture.png",
    color: "green-regular",
  },
  {
    name: "Global Warming",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/global.png",
    color: "yellow-regular",
  },
  {
    name: "Animals",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/animal.png",
    color: "beige-regular",
  },
];

const showData = [
  {
    name: "Mandalorean",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/mandalorean.png",
  },
  {
    name: "Stranger Things",
    discription: "loream ipsum dolor sit amet, consectetur",
    url: "/illustrations/stranger.png",
  },
];

const Discover = () => {
  return (
    <div className="flex flex-col">
      <div className="flex h-screen">
        <SideBar />

        <div className="backgroundImage after:content[''] before:h-vh container relative flex h-full w-full flex-col overflow-y-auto px-11 pb-11 pt-20 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0  before:bg-[url(/illustrations/bg.png)] before:opacity-[0.05]">
          {" "}
          <div className="relative z-10 mb-24 w-full">
            <Card className="w-full p-20" background="red-regular">
              <p className="mb-7 w-96 font-mono text-2xl text-white">
                Explore Fun and engaging to play with your friends
              </p>

              <TextField
                type={"text"}
                placeholder={"Search games"}
                className="text-3.5 text-4 h-10 bg-white/10 text-center font-mono font-normal placeholder:text-accent-red-dark"
              ></TextField>
              <img
                className="absolute bottom-0 right-16 w-80 "
                src="/illustrations/chicken.png"
              ></img>
            </Card>
          </div>
          <div className="relative z-10 mb-24">
            <h2 className="mb-8 w-96 font-mono text-2xl text-white">
              Featured
            </h2>
            <div className="flex flex-wrap gap-x-16 gap-y-10">
              {featutred.map((x) => {
                return (
                  <Card
                    className="text-8 relative flex w-80 py-8 pl-28 font-mono"
                    background="grey2"
                  >
                    <img className="absolute -top-4 left-6" src={x.url}></img>
                    {x.name}
                  </Card>
                );
              })}
            </div>
          </div>
          <div className="relative z-10 mb-24">
            <h2 className="mb-8 w-96 font-mono text-2xl text-white">
              Hot right now
            </h2>
            <div className="flex gap-14">
              {hotData.map((x: any) => {
                return (
                  <div className="flex w-56 flex-col">
                    <Card
                      className="flex h-56 w-56 content-center items-center"
                      background={x.color}
                    >
                      <img className="mx-auto" src={x.url}></img>
                    </Card>
                    <h4 className="text-4 mb-2 mt-4 overflow-hidden text-ellipsis whitespace-nowrap font-mono font-bold text-white">
                      {x.name}
                    </h4>
                    <p className="text-4 m-0 font-sans font-normal text-gray-400">
                      {x.discription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="mb-8 w-96 font-mono text-2xl text-white">
              Movies and Tv showa
            </h2>
            <div className="flex gap-14">
              {showData.map((x) => {
                return (
                  <Card className="px-6 py-9">
                    <div className="flex gap-10">
                      <div>
                        <Card className="flex h-56 w-56 content-center items-center border-gray-950 text-center">
                          <img className="mx-auto" src={x.url}></img>
                        </Card>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-4 mb-2 mt-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono font-bold text-white">
                          {x.name}
                        </h4>
                        <p className="text-4 m-0 font-sans font-normal text-gray-400">
                          {x.discription}
                        </p>
                        <Button
                          className="mb-0 mt-auto"
                          variant="primary"
                          size="small"
                        >
                          play
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
