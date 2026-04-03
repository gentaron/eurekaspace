'use client';

import { create } from 'zustand';

interface MediaStore {
  activeSource: 'audio' | 'video' | null;
  setActiveSource: (source: 'audio' | 'video' | null) => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  activeSource: null,
  setActiveSource: (source) => set({ activeSource: source }),
}));
