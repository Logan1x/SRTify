import { create } from "zustand";

const useStore = create((set) => ({
  receivedSubs: {},
  updateSubs: (newSubs) => set({ receivedSubs: newSubs }),
}));

export { useStore };
