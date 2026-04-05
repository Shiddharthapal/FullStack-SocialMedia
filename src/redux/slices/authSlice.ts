import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; // Use type-only import
import type { UserDetails } from "../../types/user";
// Import the correct User type

interface AuthState {
  isAuthenticated: boolean;
  user: UserDetails | null;
  token: string | null; // Add token field
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  let token = localStorage.getItem("authToken");
  let userStr = localStorage.getItem("authUser");

  if (token && userStr) {
    let user = JSON.parse(userStr);

    return {
      isAuthenticated: true,
      user: user,
      token: token,
      loading: false,
      error: null,
    };
  } else {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    };
  }
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Update payload type to use the imported User
    loginSuccess: (state, action: PayloadAction<UserDetails & { token: string }>) => {
      // Payload is User data + token

      const { token, ...userData } = action.payload; // Separate token from user data
      state.isAuthenticated = true;
      state.user = userData; // Store only user data
      state.token = token; // Store token separately
      state.loading = false;
      state.error = null;

      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          _id: action.payload._id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          password: "",
          createdAt: action.payload.createdAt,
        }),
      );
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null; // Clear token on logout
      state.loading = false;
      state.error = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
