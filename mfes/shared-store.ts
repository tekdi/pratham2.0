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
  // Set immediately (before the refetch delay) whenever a content action
  // (publish/unpublish/delete) succeeds, so a listening page can patch its
  // own list right away instead of waiting on the search index to catch up.
  // See DeleteConfirmation.tsx (producer) and allContents/index.tsx (consumer).
  lastContentAction: null,
  setLastContentAction: (action: {
    identifier: string;
    actionType: 'publish' | 'unpublish' | 'delete';
    mimeType?: string;
    ts: number;
  }) => set({ lastContentAction: action }),
}));

export default useSharedStore; 