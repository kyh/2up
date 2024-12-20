import React from "react";
import { Container } from "@init/ui/ui/container";

export default function GamePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-400">Game code</span>
          <span className="text-4xl font-semibold text-black">1234</span>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gray-300 px-10 py-2">
          <span className="text-4xl font-semibold text-black">24</span>
        </div>
      </div>

      <div>
        <Container rounded>
          <div className="flex flex-col gap-12">
            <p className="text-3xl font-semibold">
              Question about some topic Worem ipsum dolor sit amet, consectetur
              adipiscing elit. Nunc vulputate libero et velit interdum, ac
              aliquet odio mattis.
            </p>

            <div className="flex w-full flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="w-full rounded-2xl bg-gray-100 p-6 text-2xl">
                  1 Option number one
                </div>
                <div className="w-full rounded-2xl bg-gray-100 p-6 text-2xl">
                  2 Option number two
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-full rounded-2xl bg-gray-100 p-6 text-2xl">
                  3 Option number three
                </div>
                <div className="w-full rounded-2xl bg-gray-100 p-6 text-2xl">
                  4 Option number four
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="mt-5 flex items-center gap-20">
        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Goofy</p>
          <p className="text-5xl text-black">15</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Donald</p>
          <p className="text-5xl text-black">16</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Mickey</p>
          <p className="text-5xl text-black">24</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Donald</p>
          <p className="text-5xl text-black">16</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Mickey</p>
          <p className="text-5xl text-black">15</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Donald</p>
          <p className="text-5xl text-black">15</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="size-[100px] bg-gray-100" />
          <p className="text-3xl font-semibold text-black">Goofy</p>
          <p className="text-5xl text-black">20</p>
        </div>
      </div>
    </div>
  );
}
