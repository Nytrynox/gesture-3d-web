import Scene from "@/components/Scene";
import HUD from "@/components/UI/HUD";
import HandTracker from "@/components/HandTracker";

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black">
      <div className="absolute inset-0 z-0">
         <Scene />
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <HUD />
        <HandTracker />
      </div>
    </main>
  );
}
