"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "active" | "error";

export function getCameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "SecurityError":
        return "Camera access was denied. Allow camera access in your browser settings and try again.";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No camera was found on this device.";
      case "NotReadableError":
      case "TrackStartError":
        return "The camera is already in use or could not be started.";
      case "OverconstrainedError":
        return "This camera cannot meet the requested video settings.";
      default:
        return "The camera could not be started. Please try again.";
    }
  }

  return "The camera could not be started. Please try again.";
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    requestIdRef.current += 1;
    releaseStream();
    setStatus("idle");
    setError(null);
  }, [releaseStream]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access requires a supported browser and a secure connection.");
      setStatus("error");
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setError(null);
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        releaseStream();
        setStatus("error");
        setError("The camera preview could not be initialized.");
        return;
      }

      video.srcObject = stream;
      await video.play();

      if (requestId === requestIdRef.current) {
        setStatus("active");
      } else {
        releaseStream();
      }
    } catch (cameraError) {
      if (requestId === requestIdRef.current) {
        releaseStream();
        setStatus("error");
        setError(getCameraErrorMessage(cameraError));
      }
    }
  }, [releaseStream]);

  useEffect(
    () => () => {
      requestIdRef.current += 1;
      releaseStream();
    },
    [releaseStream],
  );

  return {
    error,
    startCamera,
    status,
    stopCamera,
    videoRef,
  };
}
