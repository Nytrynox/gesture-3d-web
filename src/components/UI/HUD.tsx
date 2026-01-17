"use client";

import { cn } from "@/lib/utils";
import { useGestureStore } from "@/store";

export default function HUD() {
  const { isHandDetected, gesture, handPosition } = useGestureStore();

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 text-white font-mono pointer-events-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-widest uppercase">
            Gesture Control
          </h1>
          <div className={cn(
             "flex items-center gap-2 text-sm mt-2 transition-colors duration-300",
             isHandDetected ? "text-green-400" : "text-red-500"
          )}>
            <span className="relative flex h-3 w-3">
              <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                   isHandDetected ? "bg-green-400" : "bg-red-500"
              )}></span>
              <span className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                   isHandDetected ? "bg-green-500" : "bg-red-500"
              )}></span>
            </span>
            {isHandDetected ? "System Online" : "Searching for Input..."}
          </div>
        </div>
        <div className="text-right text-xs opacity-50">
          <p>FPS: {isHandDetected ? "60" : "--"}</p>
          <p>Hand: {isHandDetected ? "DETECTED" : "NONE"}</p>
          <p>Gesture: {gesture}</p>
        </div>
      </div>

      <div className="flex justify-center">
         {!isHandDetected && (
            <div className="animate-pulse border border-white/20 bg-black/50 backdrop-blur-md px-6 py-4 rounded-full text-sm text-red-300">
               Please enable webcam & raise hand
            </div>
         )}
         {isHandDetected && (
             <div className="flex gap-4">
                 <div className="border border-green-500/30 bg-green-900/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs">
                    X: {handPosition.x.toFixed(2)}
                 </div>
                 <div className="border border-green-500/30 bg-green-900/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs">
                    Y: {handPosition.y.toFixed(2)}
                 </div>
             </div>
         )}
      </div>

      <div className="flex justify-between items-end text-xs opacity-50">
         <div>
            MOVE HAND: ROTATE<br/>
            PINCH: SHRINK<br/>
            OPEN: EXPAND
         </div>
         <div>v1.0.0</div>
      </div>
    </div>
  );
}
