import apiClient from "./apiClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = (payload: LoginPayload) =>
  apiClient.post("/auth/login", payload);

export const signup = (payload: LoginPayload & { name: string }) =>
  apiClient.post("/auth/signup", payload);

export const logout = () => apiClient.post("/auth/logout");

export const sendPasswordReset = (payload: { email: string }) =>
  apiClient.post("/auth/forgot-password", payload);

// Confirmed against backend/src/controllers/authControl.ts: verifyOtp is
// hardcoded to OTP purpose "REGISTRATION", so this endpoint only verifies
// signup codes — there is no separate password-reset verification route.
// Field is "otp" (6 digits), not "code".
export const verifySignupCode = (payload: { email: string; otp: string }) =>
  apiClient.post("/auth/verify-otp", payload);

// NOTE: backend/src/controllers/authControl.ts exports a resendOtp
// function, but it is not yet mounted to a route in server.ts (no
// /auth/resend-otp or similar). This call will fail until that route is
// added — the UI already handles that failure gracefully rather than
// breaking, per the "keep a working mock/fallback state" requirement.
export const resendSignupCode = (payload: { email: string }) =>
  apiClient.post("/auth/resendOtp", payload);

// Password reset is a single combined step on the backend — there is no
// separate "verify code" call. Field names/shape must match resetPassword
// in authControl.ts exactly: { email, otp, newPassword }.
export const resetPassword = (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => apiClient.post("/auth/reset-password", payload);

export const updateProfile = (payload: {
  businessName?: string;
  phone?: string;
  address?: string;
  isVendor?: boolean;
}) => apiClient.patch("/auth/profile", payload);

// Confirmed live: DELETE /api/auth/me
export const deleteAccount = () => apiClient.delete("/auth/me");
