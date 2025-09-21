import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((import.meta as any).env?.VITE_API_URL as string) ||
    "http://localhost:4301/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---- Auth API helpers ----
export type RegisterPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "buyer" | "freelancer";
};

export type LoginPayload = {
  identifier: string; // email or username
  password: string;
};

export type ForgotPasswordPayload = { email: string };
export type ResetPasswordPayload = { password: string };
export type ResendActivationPayload = { email: string };

export async function registerApi(payload: RegisterPayload) {
  const res = await axiosInstance.post("/auth/register", payload);
  return res.data as { message: string };
}

export async function loginApi(payload: LoginPayload) {
  const res = await axiosInstance.post("/auth/login", payload);
  return res.data as Record<string, unknown>; // server returns user details
}

export async function forgotPasswordApi(payload: ForgotPasswordPayload) {
  const res = await axiosInstance.post("/auth/forgot-password", payload);
  return res.data as { message: string };
}

export async function resetPasswordVerifyApi(id: string, token: string) {
  const res = await axiosInstance.get(`/auth/reset-password/${id}/${token}`);
  return res.data as { message: string };
}

export async function resetPasswordApi(
  id: string,
  token: string,
  payload: ResetPasswordPayload
) {
  const res = await axiosInstance.post(
    `/auth/reset-password/${id}/${token}`,
    payload
  );
  return res.data as { message: string };
}

export async function resendActivationApi(payload: ResendActivationPayload) {
  const res = await axiosInstance.post("/auth/resend-activation", payload);
  return res.data as { message: string };
}

export async function logoutApi() {
  const res = await axiosInstance.post("/auth/logout");
  return res.data as { message: string };
}

// Attach helpers for convenient default import usage in existing code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axiosInstance as any).registerApi = registerApi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axiosInstance as any).loginApi = loginApi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axiosInstance as any).forgotPasswordApi = forgotPasswordApi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axiosInstance as any).resetPasswordVerifyApi = resetPasswordVerifyApi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axiosInstance as any).resetPasswordApi = resetPasswordApi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(axiosInstance as any).resendActivationApi = resendActivationApi;

export default axiosInstance;
