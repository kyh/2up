import React from "react";

import Avatar from "./ui/NosAvatar";

export default function Avatars() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Avatars
      </span>

      <Avatar
        alt=""
        size="normal"
        source="https://avatar.iran.liara.run/public"
      />
      <Avatar
        alt=""
        size="small"
        source="https://avatar.iran.liara.run/public"
      />
      <Avatar
        alt=""
        size="medium"
        source="https://avatar.iran.liara.run/public"
      />
      <Avatar
        alt=""
        size="large"
        source="https://avatar.iran.liara.run/public"
      />

      <Avatar
        alt=""
        size="normal"
        source="https://avatar.iran.liara.run/public"
        rounded
      />
      <Avatar
        alt=""
        size="small"
        source="https://avatar.iran.liara.run/public"
        rounded
      />
      <Avatar
        alt=""
        size="medium"
        source="https://avatar.iran.liara.run/public"
        rounded
      />
      <Avatar
        alt=""
        size="large"
        source="https://avatar.iran.liara.run/public"
        rounded
      />
    </div>
  );
}
