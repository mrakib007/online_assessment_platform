import { apiSlice } from './apiSlice';

// Generic CRUD API that works with any endpoint
export const dynamicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Generic GET all
    getAll: builder.query<any, string>({
      query: (endpoint) => endpoint,
      providesTags: (result, error, endpoint) => [{ type: 'Dynamic' as const, id: endpoint }],
    }),
    
    // Generic GET by ID
    getById: builder.query<any, { endpoint: string; id: string | number }>({
      query: ({ endpoint, id }) => `${endpoint}/${id}`,
      providesTags: (result, error, { endpoint, id }) => [
        { type: 'Dynamic' as const, id: `${endpoint}-${id}` },
      ],
    }),
    
    // Generic POST (Create)
    create: builder.mutation<any, { endpoint: string; body: any }>({
      query: ({ endpoint, body }) => ({
        url: endpoint,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { endpoint }) => [
        { type: 'Dynamic' as const, id: endpoint },
      ],
    }),
    
    // Generic PUT (Update)
    update: builder.mutation<any, { endpoint: string; id: string | number; body: any }>({
      query: ({ endpoint, id, body }) => ({
        url: `${endpoint}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { endpoint, id }) => [
        { type: 'Dynamic' as const, id: endpoint },
        { type: 'Dynamic' as const, id: `${endpoint}-${id}` },
      ],
    }),
    
    // Generic PATCH (Partial Update)
    patch: builder.mutation<any, { endpoint: string; id: string | number; body: any }>({
      query: ({ endpoint, id, body }) => ({
        url: `${endpoint}/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { endpoint, id }) => [
        { type: 'Dynamic' as const, id: endpoint },
        { type: 'Dynamic' as const, id: `${endpoint}-${id}` },
      ],
    }),
    
    // Generic DELETE
    delete: builder.mutation<any, { endpoint: string; id: string | number }>({
      query: ({ endpoint, id }) => ({
        url: `${endpoint}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { endpoint }) => [
        { type: 'Dynamic' as const, id: endpoint },
      ],
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  usePatchMutation,
  useDeleteMutation,
} = dynamicApi;
