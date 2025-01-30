import { create } from "zustand";

const useSharedStore = create((set) => ({
  fetchContentAPI: false,
  setFetchContentAPI: (status: boolean) =>
    set({ fetchContentAPI: status }),
}));

export default useSharedStore;
