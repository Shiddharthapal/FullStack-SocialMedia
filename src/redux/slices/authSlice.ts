import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDetails } from "../../types/user";

interface AuthState {
  isAuthenticated: boolean;
  user: UserDetails | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  // The slice hydrates from localStorage first so a hard refresh does not force
  // the user back to the login page before Redux Persist finishes rehydrating.
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
    loginSuccess: (state, action: PayloadAction<UserDetails & { token: string }>) => {
      // Store the token separately so components can read user details without
      // accidentally passing sensitive auth data around.
      const { token, ...userData } = action.payload;
      state.isAuthenticated = true;
      state.user = userData;
      state.token = token;
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
      state.token = null;
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
