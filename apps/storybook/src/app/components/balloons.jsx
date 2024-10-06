import React from "react";
import { Balloon } from "@2up/ui/ui/balloon";
import { Container } from "@2up/ui/ui/container";

export default function Balloons() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Balloons
      </span>

      <Container>
        <div className="flex gap-4">
          <Balloon variant="normal" from="left">
            Hello World.css
          </Balloon>
        </div>
        <div className="flex gap-4">
          <Balloon variant="normal" from="right">
            Good morning. Thou hast had a good night's sleep, I hope.
          </Balloon>
        </div>
      </Container>

      <Container variant="dark">
        <div className="flex gap-4">
          <Balloon variant="dark" from="left">
            Hello World.css
          </Balloon>
        </div>
        <div className="flex gap-4">
          <Balloon variant="dark" from="right">
            Good morning. Thou hast had a good night's sleep, I hope.
          </Balloon>
        </div>
      </Container>
    </div>
  );
}
