import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";

// Only the auth session is persisted. Feed data and UI state are fetched again
// per page load so the store does not become stale or oversized.
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist dispatches framework actions and the profile slice keeps
        // timestamp strings, so the default serializable check needs a small exception.
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["profile.lastUpdated"],
      },
    }),
});

export const persistor = persistStore(store);

// These helper types keep hooks and slices strongly typed across the app.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
