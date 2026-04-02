import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserDetails } from "../../types/user"; // Import the correct UserDetails type

interface ProfileState {
  isEditing: boolean;
  isSaving: boolean;
  isVerifying: boolean;
  error: string | null;
  lastUpdated: string | null;
  lastVerified: string | null;
  hasProfile: boolean;
  profileCreated: boolean;
  successMessage: string | null;
}

const initialState: ProfileState = {
  isEditing: false,
  isSaving: false,
  isVerifying: false,
  error: null,
  lastUpdated: null,
  lastVerified: null,
  hasProfile: false,
  profileCreated: false,
  successMessage: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileStart: (state) => {
      state.isSaving = true;
      state.error = null;
      state.successMessage = null;
    },

    updateProfileSuccess: (
      state,
      action: PayloadAction<{
        userData: Partial<UserDetails>;
        isNewProfile?: boolean;
        profileType?: "user" | "doctor";
      }>
    ) => {
      const { isNewProfile, profileType } = action.payload;

      state.isSaving = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();

      // Update profile status
      if (isNewProfile) {
        state.profileCreated = true;
        state.hasProfile = true;
        state.successMessage = "Profile created successfully!";
      } else {
        state.successMessage = "Profile updated successfully!";
      }

      // Exit edit mode after successful save
      state.isEditing = false;
    },

    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
      if (!action.payload) {
        state.error = null;
        state.successMessage = null;
      }
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },

    resetProfileState: () => initialState,

    verifyProfileStart: (state) => {
      state.isVerifying = true;
      state.error = null;
    },

    verifyProfileSuccess: (
      state,
      action: PayloadAction<{
        hasProfile: boolean;

        profileData?: any;
      }>
    ) => {
      state.isVerifying = false;
      state.hasProfile = action.payload.hasProfile;

      state.lastVerified = new Date().toISOString();
      state.profileCreated = action.payload.hasProfile;
      state.error = null;
    },

    verifyProfileFailure: (state, action: PayloadAction<string>) => {
      state.isVerifying = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  setEditMode,
  clearMessages,
  resetProfileState,
  verifyProfileStart,
  verifyProfileSuccess,
  verifyProfileFailure,
} = profileSlice.actions;

export default profileSlice.reducer;
