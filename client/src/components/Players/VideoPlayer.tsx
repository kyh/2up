import ReactVideoPlayer from "react-player/lazy";

export const VideoPlayer = (rest: any) => {
  return <ReactVideoPlayer className="video-player" {...rest} />;
};
