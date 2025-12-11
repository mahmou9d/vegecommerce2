// // ============================================
// // authApi.ts - RTK Query
// // ============================================
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BASE_URL = "https://e-commerce-web-production-ead4.up.railway.app/api";

// // 🔹 Types
// interface SignupRequest {
//   username: string;
//   email: string;
//   password1: string;
//   password2: string;
// }

// interface SignupResponse {
//   message: string;
// }

// // 🔹 Auth API
// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
//   endpoints: (builder) => ({
//     // ✅ تسجيل مستخدم جديد
//     signup: builder.mutation<SignupResponse, SignupRequest>({
//       query: (payload) => ({
//         url: "/auth/signup/",
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: payload,
//       }),
//     }),
//   }),
// });

// // 🔹 Export hooks
// export const { useSignupMutation } = authApi;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// interface AuthSecSlice {
//   message: string;
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: AuthSecSlice = {
//   message: "",
//   loading: "idle",
//   error: null,
// };

// export const signupUser = createAsyncThunk(
//   "authSec/signupUser",
//   async (
//     payload: {
//       username: string;
//       email: string;
//       password1: string;
//       password2: string;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await fetch(
//         "https://e-commerce-web-production-ead4.up.railway.app/api/auth/signup/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       // if (!res.ok) {
//       //   throw new Error(`HTTP error! status: ${res.status}`);
//       // }
//       if (!res.ok) {
//         const errorData = await res.json();
//         return rejectWithValue(errorData); // رجع رسالة السيرفر
//       }
//       const data = await res.json();
//       return data;
//     } catch (error: any) {
//       // console.log(error,"errorsignup")
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const authSlicesec = createSlice({
//   name: "authsec",
//   initialState,
//   reducers: {
//     resetAuthSec: (state) => {
//       state.message = "";
//       state.error = null;
//       state.loading = "idle";
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(signupUser.pending, (state) => {
//       state.loading = "pending";
//       state.error = null;
//     });
//     builder.addCase(signupUser.fulfilled, (state, action) => {
//       state.loading = "succeeded";
//       state.message = action.payload.message;
//     });
//     builder.addCase(signupUser.rejected, (state, action) => {
//       state.loading = "failed";
//       state.error = action.payload as string;
//     });
//   },
// });

// export default authSlicesec.reducer;

//  type TProduct = {
//    name: string;
//    description: string;
//    original_price: number;
//    discount: number;
//    stock: number;
//    categories: string;
//    tags: string;
//    img: string;
//  };
