import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

import { UserNav } from "@/components/nav";

// export const runtime = "edge";

const Page = async () => {
  return (
    <>
      <section>
        <div className="border-gray mx-auto max-w-7xl border-x border-b p-8 lg:py-32">
          <div className="max-w-2xl">
            <span className="font-light text-neutral-400">
              Productised Web Development Studio
            </span>
            <h1 className="mt-6 text-2xl font-light text-white">
              Maximize your online presence with a unique and engaging one-page
              website that delivers outstanding results.
            </h1>
          </div>
        </div>
      </section>
      <section>
        <div className="border-gray mx-auto max-w-7xl border-x border-b">
          <div className="divide-gray grid grid-cols-1 text-white md:grid-cols-3 lg:divide-x">
            <div className="flex h-full flex-col justify-between p-8">
              <p className="text-neutral-400">
                Michael has a great eye for design and he is an absolute
                pleasure to work with. I definitely plan on working with him on
                future projects of mine. I wholeheartedly recommend him to
                anyone seeking standout, quality work.
              </p>
              <div className="mt-3">
                <span className="mt-3 block font-light">Tony Lea</span>
                <span className="block text-neutral-400">
                  Founder of Dev Dojo
                </span>
              </div>
            </div>
            <div className="flex h-full flex-col justify-between p-8">
              <p className="text-neutral-400">
                Michael has helped me with many designs, and I couldn't follow
                his working speed when we worked together. His designs are
                slick, and he delivers a lot of value; he is constantly
                iterating his designs and making improvements.
              </p>
              <div className="mt-3">
                <span className="mt-3 block font-light">Gabriel Perales</span>
                <span className="block text-neutral-400">
                  Creator of Wicked Backgrunds
                </span>
              </div>
            </div>
            <div className="flex h-full flex-col justify-between p-8">
              <p className="text-neutral-400">
                Michael is a rare breed of designer &amp; developer that
                understands business needs. He leveraged his previous experience
                to build out a few landing pages very quickly for Versoly
              </p>
              <div className="mt-3">
                <span className="mt-3 block font-light">Volkan Kaya</span>
                <span className="block text-neutral-400">
                  Founder of Versoly
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
