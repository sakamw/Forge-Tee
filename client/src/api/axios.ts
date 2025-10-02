/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
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

// ---- Freelancer application ----
export async function applyFreelancerApi(notes?: string) {
  const res = await axiosInstance.post("/freelancers/apply", { notes });
  return res.data as { message: string; application?: unknown };
}

export async function getMyApplicationApi() {
  const res = await axiosInstance.get("/freelancers/application");
  return res.data as {
    status: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
    application?: unknown;
  };
}

// ---- Admin: freelancer applications ----
export async function adminListApplicationsApi(
  status?: "PENDING" | "APPROVED" | "REJECTED",
  opts?: {
    q?: string;
    page?: number;
    pageSize?: number;
    sortBy?: "createdAt" | "status";
    sortDir?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
  }
) {
  const res = await axiosInstance.get("/admin/freelancers/applications", {
    params: {
      ...(status ? { status } : {}),
      ...(opts?.q ? { q: opts.q } : {}),
      ...(opts?.page ? { page: opts.page } : {}),
      ...(opts?.pageSize ? { pageSize: opts.pageSize } : {}),
      ...(opts?.sortBy ? { sortBy: opts.sortBy } : {}),
      ...(opts?.sortDir ? { sortDir: opts.sortDir } : {}),
      ...(opts?.dateFrom ? { dateFrom: opts.dateFrom } : {}),
      ...(opts?.dateTo ? { dateTo: opts.dateTo } : {}),
    },
  });
  return res.data as {
    applications: any[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export async function adminApproveApplicationApi(applicationId: string) {
  const res = await axiosInstance.post(
    `/admin/freelancers/${applicationId}/approve`
  );
  return res.data as { message: string };
}

export async function adminRejectApplicationApi(applicationId: string) {
  const res = await axiosInstance.post(
    `/admin/freelancers/${applicationId}/reject`
  );
  return res.data as { message: string };
}

// ---- Dashboard data (basic stubs) ----
export async function getBuyerOrdersApi() {
  const res = await axiosInstance.get("/dashboard/buyer/orders");
  return res.data as { orders: any[] };
}

export async function getFreelancerPortfolioApi() {
  const res = await axiosInstance.get("/dashboard/freelancer/portfolio");
  return res.data as { designs: any[] };
}

export async function getAdminOverviewApi() {
  const res = await axiosInstance.get("/dashboard/admin/overview");
  return res.data as {
    users: number;
    freelancers: number;
    designs: number;
    orders: number;
    pendingApprovals: number;
  };
}

// ---- Admin: users management ----
export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "BUYER" | "FREELANCER";
  isAdmin: boolean;
  verified: boolean;
  isDeleted: boolean; // true => deactivated
  dateJoined: string;
  updatedAt: string;
};

export async function adminListUsersApi(opts?: {
  q?: string;
  role?: "BUYER" | "FREELANCER";
  admin?: boolean;
  active?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "dateJoined"
    | "firstName"
    | "lastName"
    | "role"
    | "isAdmin"
    | "isDeleted";
  sortDir?: "asc" | "desc";
}) {
  const res = await axiosInstance.get("/admin/users", {
    params: {
      ...(opts?.q ? { q: opts.q } : {}),
      ...(opts?.role ? { role: opts.role } : {}),
      ...(typeof opts?.admin === "boolean"
        ? { admin: String(opts.admin) }
        : {}),
      ...(typeof opts?.active === "boolean"
        ? { active: String(opts.active) }
        : {}),
      ...(opts?.page ? { page: opts.page } : {}),
      ...(opts?.pageSize ? { pageSize: opts.pageSize } : {}),
      ...(opts?.sortBy ? { sortBy: opts.sortBy } : {}),
      ...(opts?.sortDir ? { sortDir: opts.sortDir } : {}),
    },
  });
  return res.data as {
    users: AdminUser[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export async function adminUpdateUserRoleApi(
  userId: string,
  role: "BUYER" | "FREELANCER"
) {
  const res = await axiosInstance.patch(`/admin/users/${userId}/role`, {
    role,
  });
  return res.data as { message: string };
}

export async function adminSetUserAdminApi(userId: string, isAdmin: boolean) {
  const res = await axiosInstance.patch(`/admin/users/${userId}/admin`, {
    isAdmin,
  });
  return res.data as { message: string };
}

export async function adminSetUserActiveApi(userId: string, active: boolean) {
  const res = await axiosInstance.patch(`/admin/users/${userId}/active`, {
    active,
  });
  return res.data as { message: string };
}

(axiosInstance as any).registerApi = registerApi;
(axiosInstance as any).loginApi = loginApi;
(axiosInstance as any).forgotPasswordApi = forgotPasswordApi;
(axiosInstance as any).resetPasswordVerifyApi = resetPasswordVerifyApi;
(axiosInstance as any).resetPasswordApi = resetPasswordApi;
(axiosInstance as any).resendActivationApi = resendActivationApi;

export default axiosInstance;
