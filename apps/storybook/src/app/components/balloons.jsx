import React from "react";

import bcrikkoIcon from "./icons/bcrikko-icon";
import { Balloon } from "./ui/balloon";
import { Container } from "./ui/container";

export default function Balloons() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Balloons
      </span>

      <Container>
        <div className="flex gap-4">
          <div className="relative h-24 w-24 self-end">{bcrikkoIcon}</div>
          <Balloon variant="normal" from="left">
            Hello World.css
          </Balloon>
        </div>
        <div className="flex gap-4">
          <Balloon variant="normal" from="right">
            Good morning. Thou hast had a good night's sleep, I hope.
          </Balloon>
          <div className="relative h-24 w-24 self-end">{bcrikkoIcon}</div>
        </div>
      </Container>

      <Container variant="dark">
        <div className="flex gap-4">
          <div className="relative h-24 w-24 self-end">{bcrikkoIcon}</div>
          <Balloon variant="dark" from="left">
            Hello World.css
          </Balloon>
        </div>
        <div className="flex gap-4">
          <Balloon variant="dark" from="right">
            Good morning. Thou hast had a good night's sleep, I hope.
          </Balloon>
          <div className="relative h-24 w-24 self-end">{bcrikkoIcon}</div>
        </div>
      </Container>
    </div>
  );
}
