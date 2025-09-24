import { create } from 'zustand';
import { URL_CONFIG } from '../utils/url.config';
import { FrameworksState, Framework } from '../interfaces/FrameworkInterface';
import { Category } from '../interfaces/CategoryInterface';
import { post } from '../services/RestClient';

// Zustand store for managing framework data
export const useFrameworksStore = create<FrameworksState>((set) => ({
  frameworks: [],
  loading: false,
  error: null,

  // Function to fetch frameworks from the API
  fetchFrameworks: async () => {
    set({ loading: true, error: null });
    try {
      const requestBody = {
        request: {
          filters: {
            status: ['Draft', 'Live'],
            objectType: 'Framework',
          },
        },
      };

      const url = URL_CONFIG.API.COMPOSITE_SEARCH;

      // Use RestClient post method with automatic authentication and tenant headers
      const response = await post(url, requestBody);
      const data = response.data;

      if (!Array.isArray(data?.result?.Framework)) {
        set({
          frameworks: [],
          loading: false,
          error: 'Malformed API response',
        });
        return;
      }

      // Set the frameworks state with the fetched data
      // It maps the raw data to the Framework interface, ensuring type safety.
      // Each framework object is validated and transformed to match the Framework interface.
      // It also handles cases where properties may not be present or are of unexpected types.
      // The final state includes an array of Framework objects, a loading flag, and an error
      set({
        frameworks: data.result.Framework.map((fw: unknown): Framework => {
          if (typeof fw === 'object' && fw !== null) {
            const obj = fw as { [key: string]: unknown };
            return {
              lastStatusChangedOn:
                typeof obj.lastStatusChangedOn === 'string'
                  ? obj.lastStatusChangedOn
                  : '',
              createdOn: typeof obj.createdOn === 'string' ? obj.createdOn : '',
              channel: typeof obj.channel === 'string' ? obj.channel : '',
              name: typeof obj.name === 'string' ? obj.name : '',
              identifier:
                typeof obj.identifier === 'string' ? obj.identifier : '',
              description:
                typeof obj.description === 'string'
                  ? obj.description
                  : undefined,
              lastUpdatedOn:
                typeof obj.lastUpdatedOn === 'string' ? obj.lastUpdatedOn : '',
              languageCode: Array.isArray(obj.languageCode)
                ? (obj.languageCode as string[])
                : [],
              systemDefault:
                typeof obj.systemDefault === 'string' ? obj.systemDefault : '',
              versionKey:
                typeof obj.versionKey === 'string' ? obj.versionKey : '',
              code: typeof obj.code === 'string' ? obj.code : '',
              objectType:
                typeof obj.objectType === 'string' ? obj.objectType : '',
              status: typeof obj.status === 'string' ? obj.status : '',
              type: typeof obj.type === 'string' ? obj.type : '',
              categories: Array.isArray(obj.categories)
                ? (obj.categories as Category[])
                : [],
            };
          }
          return {
            lastStatusChangedOn: '',
            createdOn: '',
            channel: '',
            name: '',
            identifier: '',
            description: undefined,
            lastUpdatedOn: '',
            languageCode: [],
            systemDefault: '',
            versionKey: '',
            code: '',
            objectType: '',
            status: '',
            type: '',
            categories: [],
          };
        }),
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      console.error('Frameworks fetch error:', err);
      set({
        error:
          err instanceof Error ? err.message : 'Failed to fetch frameworks',
        loading: false,
        frameworks: [],
      });
    }
  },
}));
