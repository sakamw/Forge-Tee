import { create } from "zustand";

export interface TShirtDesign {
  id: string;
  name: string;
  frontDesign?: string;
  backDesign?: string;
  text?: {
    content: string;
    position: { x: number; y: number };
    fontSize: number;
    color: string;
    fontFamily: string;
  }[];
  color: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  style: "crew-neck" | "v-neck" | "tank-top" | "long-sleeve";
  price: number;
  createdAt: string;
  userId: string;
}

interface DesignState {
  currentDesign: Partial<TShirtDesign>;
  savedDesigns: TShirtDesign[];
  updateCurrentDesign: (updates: Partial<TShirtDesign>) => void;
  saveDesign: (design: TShirtDesign) => void;
  loadDesign: (design: TShirtDesign) => void;
  clearCurrentDesign: () => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  currentDesign: {
    color: "#ffffff",
    size: "M",
    style: "crew-neck",
    text: [],
  },
  savedDesigns: [],
  updateCurrentDesign: (updates) =>
    set((state) => ({
      currentDesign: { ...state.currentDesign, ...updates },
    })),
  saveDesign: (design) =>
    set((state) => ({
      savedDesigns: [...state.savedDesigns, design],
    })),
  loadDesign: (design) =>
    set({
      currentDesign: design,
    }),
  clearCurrentDesign: () =>
    set({
      currentDesign: {
        color: "#ffffff",
        size: "M",
        style: "crew-neck",
        text: [],
      },
    }),
}));
