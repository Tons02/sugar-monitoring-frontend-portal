import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SUGAR_MONITORING_ENDPOINT, // Corrected base URL
    prepareHeaders: (headers) => {
      // Add the authorization token from localStorage (if it exists)
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set("Accept", "application/json"); // JSON content type
      return headers;
    },
  }),
  tagTypes: ['Users', 'DailySugar'],
  endpoints: (builder) => ({
    // User endpoints
    getUser: builder.query({
      query: ({ search, page, per_page, status }) => `/user?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
      method: 'GET',
      providesTags: ['Users'],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: `/user`,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: `/user/${user.id}`,
        method: 'PATCH',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    archivedUser: builder.mutation({
      query: ({ id }) => ({
        url: `/user-archived/${id}`,
        method: 'PUT',
        body: id,
      }),
      invalidatesTags: ['Users'],
    }),

    // Daily Sugar endpoints
    getDailySugar: builder.query({
      query: ({ search, page, per_page, status, userID }) => `/daily-sugar?search=${search}&page=${page}&per_page=${per_page}&status=${status}&user=${userID}`,
      method: 'GET',
      providesTags: ['DailySugar'],
    }),
    addDailySugar: builder.mutation({
      query: (dailySugar) => ({
        url: `/daily-sugar`,
        method: 'POST',
        body: dailySugar,
      }),
      invalidatesTags: ['DailySugar'],
    }),
    updateDailySugar: builder.mutation({
      query: (dailySugar) => ({
        url: `/daily-sugar/${dailySugar.id}`,
        method: 'PATCH',
        body: dailySugar,
      }),
      invalidatesTags: ['DailySugar'],
    }),
    archivedDailySugar: builder.mutation({
      query: ({ id }) => ({
        url: `/daily-sugar-archived/${id}`,
        method: 'PUT',
        body: id,
      }),
      invalidatesTags: ['DailySugar'],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useArchivedUserMutation,
  useGetDailySugarQuery,
  useAddDailySugarMutation,
  useUpdateDailySugarMutation,
  useArchivedDailySugarMutation,
} = apiSlice;
