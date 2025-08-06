import { create } from "zustand";

const useSharedStore = create((set) => ({
  fetchContentAPI: false,
  contentArray: [],
  setFetchContentAPI: (status: boolean) =>
    set({ fetchContentAPI: status }),
  addToContentArray: (content: any) =>
    set((state: any) => ({ 
      contentArray: [...(state.contentArray || []), content] 
    })),
}));

export default useSharedStore; 