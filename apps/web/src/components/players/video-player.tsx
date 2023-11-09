"use client";

import ReactVideoPlayer from "react-player/lazy";

export const VideoPlayer = (
  props: React.ComponentProps<typeof ReactVideoPlayer>,
) => {
  return <ReactVideoPlayer className="video-player" {...props} />;
};
