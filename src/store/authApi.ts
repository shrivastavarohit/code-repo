import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenRequest {
  email: string;
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Get token from state for protected endpoints
      const { accessToken, refreshToken } = (getState() as any).auth;

      if (endpoint === 'refreshToken' && refreshToken) {
        headers.set('Authorization', `Bearer ${refreshToken}`);
      } else if (accessToken && ['logout', 'getDemo'].includes(endpoint)) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),
    validateToken: builder.mutation<any, ValidateTokenRequest>({
      query: (tokenData) => ({
        url: '/auth/validateToken',
        method: 'POST',
        body: tokenData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getDemo: builder.query<any, void>({
      query: () => '/demo',
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useValidateTokenMutation,
  useLogoutMutation,
  useGetDemoQuery,
} = authApi;
