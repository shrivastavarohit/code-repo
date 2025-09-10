import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
  } | null;
}

// Helper function to validate if token exists and is not empty
const getValidToken = (key: string): string | null => {
  const token = localStorage.getItem(key);
  return token && token.trim() !== '' ? token : null;
};

// Helper function to get valid user from localStorage
const getValidUser = (): AuthState['user'] => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    // Validate user has required properties
    if (user && user.email && user.firstName && user.lastName && user.role) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  accessToken: getValidToken('accessToken'),
  refreshToken: getValidToken('refreshToken'),
  isAuthenticated: false, // Will be set properly below
  user: getValidUser(),
};

// Only set authenticated if we have both valid token AND valid user
initialState.isAuthenticated = !!(
  initialState.accessToken && initialState.user
);

// Clear invalid auth data if we have a token but no user, or vice versa
if (
  !initialState.isAuthenticated &&
  (initialState.accessToken || initialState.user)
) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  initialState.accessToken = null;
  initialState.refreshToken = null;
  initialState.user = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: any;
      }>
    ) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Only set as authenticated if we have user data
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        // If no user data, don't authenticate yet
        state.isAuthenticated = false;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.clear(); // Clear all localStorage
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
  },
});

export const { setCredentials, logout, clearAuth, updateToken } =
  authSlice.actions;
export default authSlice.reducer;
