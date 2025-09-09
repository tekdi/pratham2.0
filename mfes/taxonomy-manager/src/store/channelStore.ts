import { create } from 'zustand';
import { URL_CONFIG } from '../utils/url.config';
import { ChannelState } from '../interfaces/ChannelInterface';
import { post } from '../services/RestClient';

// Zustand store for managing channel data
// This store handles fetching channels, managing loading state, and error handling.
export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  loading: false,
  error: null,
  // Function to fetch channels from the API
  // It sets loading to true while fetching, and updates channels or error based on the response
  fetchChannels: async () => {
    set({ loading: true, error: null });
    try {
      const requestBody = {
        request: {
          filters: {
            status: ['Live'],
            objectType: 'Channel',
          },
        },
      };

      const url = URL_CONFIG.API.COMPOSITE_SEARCH;

      // Use RestClient post method with automatic authentication and tenant headers
      const response = await post(url, requestBody);
      const data = response.data;

      // Check if the result is an array of channels
      if (!Array.isArray(data?.result?.Channel)) {
        // If the result is not an array, set error state
        set({
          channels: [],
          loading: false,
          error: 'Malformed API response',
        });
        return;
      }
      // Set the channels state with the fetched data
      set({
        channels: data.result.Channel.map((ch: unknown) => {
          if (typeof ch === 'object' && ch !== null) {
            const obj = ch as Record<string, unknown>;
            const {
              identifier = '',
              name = '',
              status = '',
              lastUpdatedOn = '',
              ...extra
            } = obj;
            return {
              identifier: String(identifier),
              name: String(name),
              status: String(status),
              lastUpdatedOn: String(lastUpdatedOn),
              extra,
            };
          }
          return {
            identifier: '',
            name: '',
            status: '',
            lastUpdatedOn: '',
          };
        }),
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      console.error('Channels fetch error:', err);
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch channels',
        loading: false,
        channels: [],
      });
    }
  },
}));
