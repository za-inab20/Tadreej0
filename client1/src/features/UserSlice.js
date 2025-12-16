import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000";

// ✅ LOGIN
export const getUser = createAsyncThunk(
  "users/getUser",
  async (udata, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, udata);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ✅ REGISTER
export const addUser = createAsyncThunk(
  "users/addUser",
  async (udata, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, udata);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// 🔐 Forgot password: request reset code
export const requestPasswordReset = createAsyncThunk(
  "users/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      return { email, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reset code");
    }
  }
);

// 🔐 Verify OTP
export const verifyOtp = createAsyncThunk(
  "users/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/verify-otp`, payload);
      return { ...payload, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid or expired code");
    }
  }
);

// 🔐 Reset password
export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/reset-password`, payload);
      return { message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to reset password");
    }
  }
);

// 👤 Update User Profile
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/api/auth/profile`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

const initVal = {
  user: {},
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
  resetEmail: "",
  resetStatus: "idle",
  resetMessage: "",
  otpStatus: "idle",
  otpMessage: "",
  passwordResetStatus: "idle",
  passwordResetMessage: "",
  updateStatus: "idle",
  updateMessage: "",
};

export const UserSlice = createSlice({
  name: "users",
  initialState: initVal,
  reducers: {
    logout: (state) => {
      state.user = {};
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ REGISTER
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ✅ LOGIN
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // 🔐 REQUEST RESET
      .addCase(requestPasswordReset.pending, (state) => {
        state.resetStatus = "loading";
        state.resetMessage = "";
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.resetStatus = "succeeded";
        state.resetMessage = action.payload.message;
        state.resetEmail = action.payload.email;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.resetStatus = "failed";
        state.resetMessage = action.payload;
      })

      // 🔐 VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.otpStatus = "loading";
        state.otpMessage = "";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpStatus = "succeeded";
        state.otpMessage = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpStatus = "failed";
        state.otpMessage = action.payload;
      })

      // 🔐 RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetStatus = "loading";
        state.passwordResetMessage = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordResetStatus = "succeeded";
        state.passwordResetMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetStatus = "failed";
        state.passwordResetMessage = action.payload;
      })

      // 👤 UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = "loading";
        state.updateMessage = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateMessage = action.payload.message;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateMessage = action.payload;
      });
  },
});

export const { logout } = UserSlice.actions;
export default UserSlice.reducer;
