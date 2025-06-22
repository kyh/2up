"use client";

import { memo, useEffect, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

const SMOOTHING_WINDOW = 5;

type CameraProps = {
  onPositionChange?: (position: number) => void;
};

export const Camera = memo(function Camera({ onPositionChange }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const xPositionsRef = useRef<number[]>([]);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupCameraAndModel = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();

          videoRef.current.onloadedmetadata = async () => {
            if (!isMounted) return;

            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
            await loadModel();
          };
        }
      } catch (error) {
        console.error("Error setting up camera:", error);
      }
    };

    const loadModel = async () => {
      try {
        await tf.ready();
        await tf.setBackend("webgl");

        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };

        const model = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig,
        );

        if (!isMounted) return;

        detectorRef.current = model;
        startDetection();
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    const startDetection = () => {
      const detectFrame = async () => {
        if (
          !isMounted ||
          !videoRef.current ||
          videoRef.current.readyState !== 4 ||
          !detectorRef.current
        ) {
          if (isMounted) rafIdRef.current = requestAnimationFrame(detectFrame);
          return;
        }

        try {
          const poses = await detectorRef.current.estimatePoses(
            videoRef.current,
          );

          if (poses.length > 0) {
            poses.forEach((pose) => {
              drawSkeleton(pose, canvasRef);
            });

            const bestPose = findMostVisiblePerson(poses);
            const nose = bestPose.keypoints.find((kp) => kp.name === "nose");

            if (
              nose &&
              (nose.score ?? 0) > 0.3 &&
              videoRef.current?.videoWidth
            ) {
              xPositionsRef.current.unshift(nose.x);
              if (xPositionsRef.current.length > SMOOTHING_WINDOW) {
                xPositionsRef.current.pop();
              }

              const smoothedX = getSmoothedX(xPositionsRef.current);
              const normalizedX = smoothedX / videoRef.current.videoWidth;
              onPositionChange?.(normalizedX);
            }
          }
        } catch (error) {
          console.error("Detection error:", error);
        }

        if (isMounted) {
          rafIdRef.current = requestAnimationFrame(detectFrame);
        }
      };
      detectFrame();
    };

    void setupCameraAndModel();

    return () => {
      isMounted = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onPositionChange]);

  return (
    <div className="absolute right-1 bottom-1 aspect-video h-[288px] w-sm rounded-lg bg-black/10">
      <video ref={videoRef} className="rounded-lg" playsInline />
      <canvas ref={canvasRef} className="absolute top-0 left-0 h-full w-full" />
    </div>
  );
});

const drawSkeleton = (
  pose: poseDetection.Pose,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) => {
  if (!canvasRef.current) return;

  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  pose.keypoints.forEach((keypoint) => {
    if ((keypoint.score ?? 0) > 0.5) {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  });

  const connections = [
    ["nose", "left_eye"],
    ["nose", "right_eye"],
    ["left_eye", "left_ear"],
    ["right_eye", "right_ear"],
    ["nose", "left_shoulder"],
    ["nose", "right_shoulder"],
    ["left_shoulder", "left_elbow"],
    ["right_shoulder", "right_elbow"],
    ["left_elbow", "left_wrist"],
    ["right_elbow", "right_wrist"],
    ["left_shoulder", "right_shoulder"],
    ["left_shoulder", "left_hip"],
    ["right_shoulder", "right_hip"],
    ["left_hip", "right_hip"],
    ["left_hip", "left_knee"],
    ["right_hip", "right_knee"],
    ["left_knee", "left_ankle"],
    ["right_knee", "right_ankle"],
  ];

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

  connections.forEach(([p1Name, p2Name]) => {
    const p1 = pose.keypoints.find((kp) => kp.name === p1Name);
    const p2 = pose.keypoints.find((kp) => kp.name === p2Name);

    if (p1 && p2 && (p1.score ?? 0) > 0.5 && (p2.score ?? 0) > 0.5) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
};

const getSmoothedX = (positions: number[]) => {
  if (positions.length === 0) return 0;
  return positions.reduce((sum, val) => sum + val, 0) / positions.length;
};

const findMostVisiblePerson = (poses: poseDetection.Pose[]) => {
  return poses.reduce((bestPose, currentPose) => {
    const bestScore = bestPose.keypoints.reduce(
      (sum, kp) => sum + (kp.score ?? 0),
      0,
    );
    const currentScore = currentPose.keypoints.reduce(
      (sum, kp) => sum + (kp.score ?? 0),
      0,
    );
    return currentScore > bestScore ? currentPose : bestPose;
  });
};
