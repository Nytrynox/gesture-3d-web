import { create } from 'zustand';

type HandGesture = 'None' | 'Closed_Fist' | 'Open_Palm' | 'Pointing_Up' | 'Thumb_Up' | 'Thumb_Down' | 'Victory' | 'ILoveYou';

interface GestureState {
  isHandDetected: boolean;
  gesture: HandGesture;
  handPosition: { x: number; y: number; z: number };
  
  setHandDetected: (detected: boolean) => void;
  setGesture: (gesture: HandGesture) => void;
  setHandPosition: (pos: { x: number; y: number; z: number }) => void;
}

export const useGestureStore = create<GestureState>((set) => ({
  isHandDetected: false,
  gesture: 'None',
  handPosition: { x: 0, y: 0, z: 0 },

  setHandDetected: (detected) => set({ isHandDetected: detected }),
  setGesture: (gesture) => set({ gesture }),
  setHandPosition: (pos) => set({ handPosition: pos }),
}));
