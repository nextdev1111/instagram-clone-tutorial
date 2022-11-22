import { user } from "../../typing";
import { userLoading } from "../../utils/enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  emailVerificationRequest,
  forgotPasswordRequest,
  login,
  passwordReset,
  register,
} from "../actions/userActions";
import { HYDRATE } from "next-redux-wrapper";

export type userSliceInitialState = {
  loading: userLoading;
  error?: string;
  details?: user;
};

export const userSliceInitialState: userSliceInitialState = {
  loading: userLoading.IDLE,
};

const userSlice = createSlice({
  name: "user",
  initialState: userSliceInitialState,
  reducers: {
    logout: (state, action) => {
      state.details = undefined;
    },
    changeDetails: (state, action) => {
      state.details = action.payload;
    },
    stopLoading: (state, action) => {
      state.loading = userLoading.IDLE;
    },
    changeEmailVerifiedOption: (state, action) => {
      if (state.details) {
        state.details.isEmailVerified = true;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(
      HYDRATE,
      (
        state,
        action: PayloadAction<{ user: userSliceInitialState }, never, never>
      ) => {
        if (
          JSON.stringify(action.payload.user) !==
          JSON.stringify(userSliceInitialState)
        ) {
          state.details = action.payload.user.details;
        }
      }
    );
    // pending
    builder.addCase(login.pending, (state, action) => {
      state.loading = userLoading.LOGIN;
      state.error = undefined;
    });
    // rejected
    builder.addCase(login.rejected, (state, action) => {
      state.loading = userLoading.IDLE;
      state.error = action.error.message;
    });
    // fulfilled
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = userLoading.IDLE;
      state.details = action.payload;
    });
    // pending
    builder.addCase(register.pending, (state, action) => {
      state.loading = userLoading.REGISTER;
      state.error = undefined;
    });
    // rejected
    builder.addCase(register.rejected, (state, action) => {
      state.loading = userLoading.IDLE;
      state.error = action.error.message;
    });
    // fulfilled
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = userLoading.IDLE;
      state.details = action.payload;
    });
    // pending
    builder.addCase(forgotPasswordRequest.pending, (state, action) => {
      state.loading = userLoading.FORGOTPASSWORD;
      state.error = undefined;
    });
    // rejected
    builder.addCase(forgotPasswordRequest.rejected, (state, action) => {
      state.loading = userLoading.IDLE;
      state.error = action.error.message;
    });
    // fulfilled
    builder.addCase(forgotPasswordRequest.fulfilled, (state, action) => {
      state.loading = userLoading.IDLE;
    });
    // pending
    builder.addCase(passwordReset.pending, (state, action) => {
      state.loading = userLoading.PASSWORDRESET;
      state.error = undefined;
    });
    // rejected
    builder.addCase(passwordReset.rejected, (state, action) => {
      state.loading = userLoading.IDLE;
      state.error = action.error.message;
    });
    // fulfilled
    builder.addCase(passwordReset.fulfilled, (state, action) => {
      state.loading = userLoading.IDLE;
    });
    // pending
    builder.addCase(emailVerificationRequest.pending, (state, action) => {
      state.loading = userLoading.EMAILVERIFICATIONREQUEST;
      state.error = undefined;
    });
    // rejected
    builder.addCase(emailVerificationRequest.rejected, (state, action) => {
      state.loading = userLoading.IDLE;
      state.error = action.error.message;
    });
    // fulfilled
    builder.addCase(emailVerificationRequest.fulfilled, (state, action) => {
      state.loading = userLoading.IDLE;
    });
  },
});

// exporting reducers as default
const userReducers = userSlice.reducer;
export default userReducers;

export const userActions = userSlice.actions;
