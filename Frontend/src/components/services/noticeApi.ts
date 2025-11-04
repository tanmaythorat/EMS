// services/noticeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const noticeApi = createApi({
  reducerPath: 'noticeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Notice'],
  endpoints: (builder) => ({
    getNotices: builder.query({
      query: () => 'notices/admin',
      providesTags: ['Notice'],
    }),
    getNotice: builder.query({
      query: (id) => `notices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notice', id }],
    }),
    createNotice: builder.mutation({
      query: (body) => ({
        url: 'notices',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notice'],
    }),
  }),
});

export const {
  useGetNoticesQuery,
  useGetNoticeQuery,
  useCreateNoticeMutation,
} = noticeApi;