import React from "react";
import { Button } from "@init/ui/ui/button";
import { Container } from "@init/ui/ui/container";
import { IconButton } from "@init/ui/ui/icon-button";
import { Input } from "@init/ui/ui/input";

import ArrowRightIcon from "@/public/icons/arrow-right.svg";
import ChevronLeft from "@/public/icons/chevron-left.svg";
import ChevronRight from "@/public/icons/chevron-right.svg";
import DayIcon from "@/public/icons/day.svg";
import KeyIcon from "@/public/icons/key.svg";
import LightbuldIcon from "@/public/icons/lightbulb.svg";
import ProfileIcon from "@/public/icons/profile.svg";
import SearchIcon from "@/public/icons/search.svg";

export default function DiscoveryPage() {
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-medium uppercase">Discover</h1>

        <div className="flex items-center gap-10">
          <IconButton variant="transparent" icon={<SearchIcon />} />
          <IconButton variant="transparent" icon={<DayIcon />} />
          <IconButton variant="transparent" icon={<ProfileIcon />} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-primary flex h-[392px] w-full max-w-[800px] flex-col gap-8 rounded-2xl p-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-normal text-3xl font-medium">
              Learn faster with friends
            </h2>
            <p className="text-normal">
              Explore our catalogue of fun and engaging games
            </p>
          </div>

          <div>
            <Input
              variant="normal"
              name="GameSearch"
              placeholder="Search Games"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-normal flex h-[184px] w-full max-w-[395px] items-center justify-start gap-4 rounded-2xl p-6">
            <KeyIcon />

            <div className="flex flex-col justify-center">
              <p className="text-2xl font-medium">Have a code?</p>
              <div>
                <Button
                  variant="link"
                  className="text-yellow-600"
                  rightIcon={<ArrowRightIcon />}
                >
                  JOIN GAME
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-normal flex h-[184px] w-full max-w-[395px] items-center justify-start gap-4 rounded-2xl p-6">
            <LightbuldIcon />

            <div className="flex flex-col justify-center">
              <p className="text-2xl font-medium">Customize your own game</p>
              <div>
                <Button
                  variant="link"
                  className="text-yellow-600"
                  rightIcon={<ArrowRightIcon />}
                >
                  CREATE GAME
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container variant="normal" rounded>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-dark text-3xl font-medium">Featured</h2>

          <Button variant="link">
            <span className="uppercase text-yellow-600 underline">See All</span>
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
        </div>
      </Container>

      <Container variant="transparent">
        <div className="flex w-full items-center gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="flex gap-6 bg-white p-4">
                <div className="size-[160px] flex-shrink-0 bg-gray-50" />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-2xl font-medium">Game title</p>
                    <p>Game description which can be two lines long</p>
                  </div>
                  <div>
                    <Button variant="ghost" className="text-yellow-600">
                      Play game
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 bg-white p-4">
                <div className="size-[160px] flex-shrink-0 bg-gray-50" />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-2xl font-medium">Game title</p>
                    <p>Game description which can be two lines long</p>
                  </div>
                  <div>
                    <Button variant="ghost" className="text-yellow-600">
                      Play game
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex w-full max-w-[184px] flex-col items-center justify-center gap-2 rounded-2xl bg-white px-5 py-10">
                <div className="size-16 bg-gray-50" />
                <p className="text-dark text-lg">Puzzles</p>
              </div>

              <div className="flex w-full max-w-[184px] flex-col items-center justify-center gap-2 rounded-2xl bg-white px-5 py-10">
                <div className="size-16 bg-gray-50" />
                <p className="text-dark text-lg">Puzzles</p>
              </div>

              <div className="flex w-full max-w-[184px] flex-col items-center justify-center gap-2 rounded-2xl bg-white px-5 py-10">
                <div className="size-16 bg-gray-50" />
                <p className="text-dark text-lg">Puzzles</p>
              </div>

              <div className="flex w-full max-w-[184px] flex-col items-center justify-center gap-2 rounded-2xl bg-white px-5 py-10">
                <div className="size-16 bg-gray-50" />
                <p className="text-dark text-lg">Puzzles</p>
              </div>
            </div>
          </div>

          <div className="flex h-[428px] w-full max-w-[392px] flex-shrink-0 flex-col gap-2 rounded-2xl bg-orange-400 p-6">
            <p className="text-xl font-medium uppercase">TOP RATED</p>
            <p className="text-3xl font-medium">Music across the decades</p>
          </div>
        </div>
      </Container>

      <Container variant="normal" rounded>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-dark text-3xl font-medium">Hot and new</h2>

          <Button variant="link">
            <span className="uppercase text-yellow-600 underline">See All</span>
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-[276px] flex-col gap-4 rounded-2xl">
            <div className="h-[188px] w-[276px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>
            </div>
          </div>
        </div>
      </Container>

      <Container variant="normal" rounded>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-dark text-3xl font-medium">
            Recommended for you
          </h2>

          <div className="flex items-center gap-3">
            <IconButton
              className="bg-yellow-500"
              variant="transparent"
              icon={<ChevronLeft />}
            />
            <IconButton
              className="bg-yellow-500"
              variant="transparent"
              icon={<ChevronRight />}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-6">
          <div className="flex w-full gap-4 rounded-2xl">
            <div className="size-[240px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1 py-6">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>

              <div>
                <Button className="mt-8" variant="warning">
                  PLAY
                </Button>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-4 rounded-2xl">
            <div className="size-[240px] rounded-2xl bg-gray-50" />

            <div className="flex flex-col gap-1 py-6">
              <p className="text-dark text-2xl font-medium">Geography pack</p>
              <p className="text-dark text-sm">
                Game description which can be two lines long
              </p>

              <div>
                <Button className="mt-8" variant="warning">
                  PLAY
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container variant="transparent">
        <div className="flex w-full flex-col gap-6">
          <h2 className="text-dark text-4xl font-medium">Browse all games</h2>
          <div className="flex w-full items-center gap-20">
            <div className="flex w-full items-center">
              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">History</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Animals</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Technology</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Puzzles</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Health</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Geography</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Space</p>
              </div>

              <div className="flex w-full max-w-[140px] flex-col items-center justify-center gap-2">
                <div className="size-16 bg-white" />
                <p className="font-medium">Space</p>
              </div>
            </div>

            <Button variant="warning">FILTER</Button>
          </div>
        </div>
      </Container>

      <Container variant="transparent">
        <div className="flex w-full flex-col gap-10">
          <div className="flex items-center gap-6">
            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">Game description short</p>
              </div>
            </div>

            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be two lines long
                </p>
              </div>
            </div>

            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be one line
                </p>
              </div>
            </div>

            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be two lines long
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be two lines long
                </p>
              </div>
            </div>

            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be two lines long
                </p>
              </div>
            </div>

            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be two lines long
                </p>
              </div>
            </div>

            <div className="flex h-[256px] flex-col gap-3 rounded-2xl bg-white p-4">
              <div className="h-[144px] w-[256px] rounded-2xl bg-gray-50" />

              <div className="flex flex-col gap-1">
                <p className="text-dark text-2xl font-medium">Game title</p>
                <p className="text-dark text-sm">
                  Game description which can be two lines long
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
