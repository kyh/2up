import { useEffect, useRef, useState } from "react";

export type GameAssets = {
  loaded: boolean;
  birdSprites?: HTMLImageElement[];
  numberSprites?: HTMLImageElement[];
  background?: HTMLImageElement;
  gameOver?: HTMLImageElement;
  message?: HTMLImageElement;
  pipe?: HTMLImageElement;
  sounds?: {
    point: HTMLAudioElement | null;
    hit: HTMLAudioElement | null;
    wing: HTMLAudioElement | null;
  };
};

export const useGameAssets = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const assetsRef = useRef<GameAssets>({
    loaded: false,
    sounds: {
      point: null,
      hit: null,
      wing: null,
    },
  });

  useEffect(() => {
    // Image assets
    const birdUrls = [
      "/flappy-bird/yellowbird-downflap.png",
      "/flappy-bird/yellowbird-midflap.png",
      "/flappy-bird/yellowbird-upflap.png",
    ];
    const numberUrls = [
      "/flappy-bird/0.png",
      "/flappy-bird/1.png",
      "/flappy-bird/2.png",
      "/flappy-bird/3.png",
      "/flappy-bird/4.png",
      "/flappy-bird/5.png",
      "/flappy-bird/6.png",
      "/flappy-bird/7.png",
      "/flappy-bird/8.png",
      "/flappy-bird/9.png",
    ];
    const backgroundUrl = "/flappy-bird/background-day.png";
    const gameOverUrl = "/flappy-bird/gameover.png";
    const messageUrl = "/flappy-bird/message.png";
    const pipeUrl = "/flappy-bird/pipe-green.png";

    // Sound assets
    const soundUrls = {
      point: "/flappy-bird/point.wav",
      hit: "/flappy-bird/hit.wav",
      wing: "/flappy-bird/wing.wav",
    };

    // Loader functions
    const loadImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

    const loadAudio = (url: string) =>
      new Promise<HTMLAudioElement>((resolve, reject) => {
        const audio = new Audio(url);
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = reject;
        audio.src = url;
      });

    // Load all assets in parallel
    void Promise.all([
      // Load images
      ...birdUrls.map(loadImage),
      ...numberUrls.map(loadImage),
      loadImage(backgroundUrl),
      loadImage(gameOverUrl),
      loadImage(messageUrl),
      loadImage(pipeUrl),
      // Load sounds
      loadAudio(soundUrls.point),
      loadAudio(soundUrls.hit),
      loadAudio(soundUrls.wing),
    ]).then((loadedAssets) => {
      // Split the loaded assets into images and sounds
      const imageAssets = loadedAssets.slice(0, 16) as HTMLImageElement[];
      const soundAssets = loadedAssets.slice(16) as HTMLAudioElement[];

      assetsRef.current = {
        loaded: true,
        birdSprites: imageAssets.slice(0, 3),
        numberSprites: imageAssets.slice(3, 13),
        background: imageAssets[13]!,
        gameOver: imageAssets[14]!,
        message: imageAssets[15]!,
        pipe: imageAssets[16]!,
        sounds: {
          point: soundAssets[0] ?? null,
          hit: soundAssets[1] ?? null,
          wing: soundAssets[2] ?? null,
        },
      };
      setAssetsLoaded(true);
    });
  }, []);

  const playSound = (soundName: "point" | "hit" | "wing") => {
    const sound = assetsRef.current.sounds?.[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) =>
          console.error(`Error playing ${soundName} sound:`, error),
        );
    }
  };

  return {
    assetsLoaded,
    assets: assetsRef.current,
    playSound,
  };
};
