import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getProducts: builder.query({
            query: ({keyword,pageNumber})=>({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                }
            }),
            providesTags: ['product'],
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query({
            query: (productId)=>({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor :5
        }),
        createProduct: builder.mutation({
            query: ()=>({
                url: `${PRODUCTS_URL}`,
                method: 'POST',
            }),
        }),
        updateProduct: builder.mutation({
            query: (data)=>({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['product'],
        }),
        uploadImage: builder.mutation({
            query: (data)=>({
                url: `/api/upload`,
                method: "POST",
                body: data,
            }),
        }),
        delteProduct: builder.mutation({
            query: (productId)=>({
                url:`${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
        }),
        createReview: builder.mutation({
            query:(data)=>({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data

            }),
            invalidatesTags: ['product'],
        }),
        getTopProducts: builder.query({
            query: () => `${PRODUCTS_URL}/top`,
            keepUnusedDataFor: 5,
        }),
    }),
});
export const {useGetProductsQuery,useGetProductDetailsQuery,useCreateProductMutation,useUpdateProductMutation,useUploadImageMutation,useDelteProductMutation,useCreateReviewMutation,useGetTopProductsQuery}=productApiSlice;