import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://10.10.8.25:8002/api', // Corrected base URL
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
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/user',
      method: 'GET',
    }),
    addUser: builder.mutation({
        query: (user) => ({
            url: `/user`,
            method: 'POST',
            body: user,
        }) 
    }),
    updateUser: builder.mutation({
        query: (user) => ({
            url: `/user/${user.id}`,
            method: 'PATCH',
            body: user
        }) 
    }),
    archivedUser: builder.mutation({
        query: ({ id }) => ({
            url: `/user/${id}`,
            method: 'PUT',
            body: id
        }) 
    }),
  }),
});

// Export the generated hook
export const { useGetUserQuery, useAddUserMutation, useUpdateUserMutation, useArchivedUserMutation } = apiSlice;
