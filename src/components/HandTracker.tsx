"use client";

import { useEffect, useRef } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useGestureStore } from "@/store";

export default function HandTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setHandDetected, setGesture, setHandPosition } = useGestureStore();
  const requestRef = useRef<number>(0);

  useEffect(() => {
    let handLandmarker: HandLandmarker | undefined;
    let runningMode: "IMAGE" | "VIDEO" = "VIDEO";

    const setupMediaPipe = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: runningMode,
        numHands: 1,
      });
      startWebcam();
    };

    const startWebcam = async () => {
      if (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        videoRef.current
      ) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: 1280,
              height: 720,
              facingMode: "user"
            },
          });
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      }
    };

    let lastVideoTime = -1;
    const predictWebcam = () => {
      if (!handLandmarker || !videoRef.current || !canvasRef.current) return;
      
      let startTimeMs = performance.now();
      if (videoRef.current.currentTime !== lastVideoTime) {
        lastVideoTime = videoRef.current.currentTime;
        const results = handLandmarker.detectForVideo(
            videoRef.current,
            startTimeMs
        );

        const canvasCtx = canvasRef.current.getContext("2d");
        if (canvasCtx) {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            // Optionally draw landmarks for debugging
            // const drawingUtils = new DrawingUtils(canvasCtx);
             if (results.landmarks) {
                for (const landmarks of results.landmarks) {
                  // drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS);
                  // drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
                  
                  // Simple logic to detect "Open_Palm" vs "Closed_Fist"
                  // Calculate average finger tip vs palm distance or use built-in gestures if classifier used (the default model is landmarks only generally, but GestureRecognizer is better for names. 
                  // HOWEVER, HandLandmarker also outputs handedness. 
                  // For simplicity, let's just track position of index finger tip (8) for now.
                  
                  // Index finger tip is index 8. Wrist is 0.
                  const indexTip = landmarks[8];
                  // scale x to -1 to 1 (webcam is mirrored usually)
                  // video is 1280x720. results are normalized [0,1].
                  // R3F scene: x [-1, 1], y [-1, 1] approximately for simple mapping.
                  
                  const x = (indexTip.x - 0.5) * 2 * -1; // Mirror and center
                  const y = -(indexTip.y - 0.5) * 2; // Invert y
                  
                  setHandPosition({ x, y, z: indexTip.z });
                  setHandDetected(true);
                  
                  // Super basic gesture check: Pinched (Index tip near Thumb tip)
                  const thumbTip = landmarks[4];
                  const dist = Math.sqrt(
                      Math.pow(indexTip.x - thumbTip.x, 2) + 
                      Math.pow(indexTip.y - thumbTip.y, 2)
                  );
                  
                  if (dist < 0.05) {
                      setGesture('Closed_Fist'); // Treating pinch as "grab/close" kind of
                  } else {
                      setGesture('Open_Palm');
                  }
                }
             } else {
                 setHandDetected(false);
                 setGesture('None');
             }
             canvasCtx.restore();
        }
      }
      requestRef.current = requestAnimationFrame(predictWebcam);
    };

    setupMediaPipe();

    return () => {
        if(requestRef.current) cancelAnimationFrame(requestRef.current);
        if(handLandmarker) handLandmarker.close();
        // stop video stream
        if(videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
    }
  }, [setGesture, setHandDetected, setHandPosition]);

  return (
    <div className="fixed bottom-0 left-0 p-4 z-50 opacity-50 pointer-events-none grayscale hover:grayscale-0 transition-all">
      {/* Hidden processing canvas/video, or shown for debug */}
      <div className="relative w-32 h-24 bg-gray-900 rounded-lg overflow-hidden border border-white/20">
         <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            // transform scale-x-[-1] to mirror for user feel
            style={{ transform: "scaleX(-1)" }}
         />
         <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"
         />
      </div>
    </div>
  );
}
