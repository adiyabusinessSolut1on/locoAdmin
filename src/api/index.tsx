import { createApi, fetchBaseQuery, } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export interface NewPost {
  path: string;
  data: string | number | boolean | Record<string, unknown>;
}

export interface Path {
  url: string;
}

export const adminAPIS = createApi({
  reducerPath: "webBuilderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authToken.userToken || localStorage.getItem("user");
      console.log("from post", token);
      if (token) {
        headers.set("authorization", `${token}`);
      }
      headers.set("Content-type", "application/json; charset=UTF-8");
      return headers;
    },
  }),

  //used for caching and invalidation
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (newPost: NewPost) => {
        // const token = localStorage.getItem("user");
        // console.log(token);
        console.log(newPost);
        return {
          url: newPost.path,
          method: "POST",
          body: newPost.data,
          // headers: {
          //   Authorization: `${token}`,
          // },
        };
      },
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: (newPost) => {
        const tokenn = localStorage.getItem("user");
        return {
          url: newPost.path,
          method: newPost?.method || "PUT",
          body: newPost.data,
          headers: {
            Authorization: `${newPost.token || tokenn}`,
          },
        };
      },
      invalidatesTags: ["Post"],
    }),
    getData: builder.query({
      query: (path) => {
        const token = localStorage.getItem("user");
        return {
          url: path.url,
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        };
      },
      providesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (newPost) => {
        // const tokenn = localStorage.getItem("user");
        return {
          url: newPost.url,
          method: "DELETE",
          // headers: {
          //   Authorization: `${newPost.token || tokenn}`,
          // },
        };
      },
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetDataQuery,
  useDeletePostMutation,
} = adminAPIS;

export type UseCreatePostMutationType = ReturnType<typeof useCreatePostMutation>;
export type useUpdatePostMutationType = ReturnType<typeof useUpdatePostMutation>;
export type useGetDataQueryType = ReturnType<typeof useGetDataQuery>;
export type useDeletePostMutationType = ReturnType<typeof useDeletePostMutation>;
