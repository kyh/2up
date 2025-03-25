"use client";

import React, { memo, useEffect, useRef } from "react";
import {
  DrawingUtils,
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const THRESHOLD = 0.07; // Default threshold value

type MouthDetectionProps = {
  onMouthChange?: (open: boolean) => void;
};

export const MouthDetection = memo(function MouthDetection({
  onMouthChange,
}: MouthDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const resultsRef = useRef<any>(undefined);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Combined useEffect for setup and cleanup
  useEffect(() => {
    async function initialize() {
      // Setup canvas context
      if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext("2d");
        if (canvasCtx) {
          drawingUtilsRef.current = new DrawingUtils(canvasCtx);
        }
      }

      // Initialize face landmarker
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
      );

      const landmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: `/pacman/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        },
      );

      faceLandmarkerRef.current = landmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        void videoRef.current.play();

        videoRef.current.onloadeddata = () => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }

          predictWebcam();
        };
      }
    }

    initialize().catch(console.error);

    // Clean up on unmount
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      // Close video stream if active
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Helper function to detect if mouth is open
  const detectMouthOpen = (landmarks: any) => {
    if (!landmarks) return false;

    // Get the upper and lower lip points
    // Landmark indices based on MediaPipe face landmarks
    // Upper lip top point: 13
    // Lower lip bottom point: 14
    // Face vertical reference: 10 (nose) and 152 (chin)
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const nose = landmarks[10];
    const chin = landmarks[152];

    if (!upperLip || !lowerLip || !nose || !chin) return false;
    // Calculate mouth opening as a ratio relative to face height
    const mouthOpenDistance = Math.abs(upperLip.y - lowerLip.y);
    const faceHeight = Math.abs(nose.y - chin.y);

    const mouthOpenRatio = mouthOpenDistance / faceHeight;

    return mouthOpenRatio > THRESHOLD;
  };

  const predictWebcam = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !faceLandmarkerRef.current ||
      !drawingUtilsRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    const startTimeMs = performance.now();

    if (!canvasCtx) {
      return;
    }

    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;
      resultsRef.current = faceLandmarkerRef.current.detectForVideo(
        video,
        startTimeMs,
      );
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (resultsRef.current?.faceLandmarks) {
      for (const landmarks of resultsRef.current.faceLandmarks) {
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#C0C0C070", lineWidth: 1 },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: "#30FF30" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: "#30FF30" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#30FF30" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: "#30FF30" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#E0E0E0" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#E0E0E0" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          { color: "#30FF30" },
        );
        drawingUtilsRef.current.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: "#30FF30" },
        );

        // Check if mouth is open
        const mouthOpen = detectMouthOpen(landmarks);
        onMouthChange?.(mouthOpen);
      }
    }

    canvasCtx.restore();

    animationFrameRef.current = window.requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="absolute right-1 bottom-1 z-1 aspect-video h-[288px] w-sm rounded-lg bg-black/10">
      <video ref={videoRef} className="rounded-lg" playsInline />
      <canvas ref={canvasRef} className="absolute top-0 left-0 h-full w-full" />
    </div>
  );
});
