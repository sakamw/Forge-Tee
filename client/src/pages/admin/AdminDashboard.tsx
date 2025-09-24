/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Users, DollarSign, BarChart3 } from "lucide-react";
import ConfirmModal from "../../components/modals/ConfirmModal";
import AppDetailsDrawer from "../../components/drawers/AppDetailsDrawer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  logoutApi,
  adminListApplicationsApi,
  adminApproveApplicationApi,
  adminRejectApplicationApi,
  getAdminOverviewApi,
  adminListUsersApi,
  adminUpdateUserRoleApi,
  adminSetUserAdminApi,
  adminSetUserActiveApi,
  type AdminUser,
} from "../../api/axios";

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<any[] | null>(null);
  const [appStatusFilter, setAppStatusFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [loadingApps, setLoadingApps] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [appPage, setAppPage] = useState(1);
  const [appTotal, setAppTotal] = useState(0);
  const [appSearchDebounced, setAppSearchDebounced] = useState("");
  const [overview, setOverview] = useState<{
    users: number;
    freelancers: number;
    designs: number;
    orders: number;
    pendingApprovals: number;
  } | null>(null);
  const [usersData, setUsersData] = useState<AdminUser[] | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [userSearchDebounced, setUserSearchDebounced] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<
    "ALL" | "BUYER" | "FREELANCER"
  >("ALL");
  const [userAdminFilter, setUserAdminFilter] = useState<
    "ALL" | "ADMIN" | "NON_ADMIN"
  >("ALL");
  const [userActiveFilter, setUserActiveFilter] = useState<
    "ALL" | "ACTIVE" | "DEACTIVATED"
  >("ALL");

  const [appPageSize, setAppPageSize] = useState(10);
  const [userPageSize, setUserPageSize] = useState(10);

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<
    null | (() => Promise<void> | void)
  >(null);

  function openConfirm(opts: {
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  }) {
    setConfirmTitle(opts.title);
    setConfirmMessage(opts.message);
    setOnConfirm(() => opts.onConfirm);
    setConfirmOpen(true);
  }

  // Application Details Drawer state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsApp, setDetailsApp] = useState<any | null>(null);

  // Applications sorting and date filters
  const [appSortBy, setAppSortBy] = useState<"createdAt" | "status">(
    "createdAt"
  );
  const [appSortDir, setAppSortDir] = useState<"asc" | "desc">("desc");
  const [appDateFrom, setAppDateFrom] = useState<string>("");
  const [appDateTo, setAppDateTo] = useState<string>("");

  // Users sorting controls
  const [userSortBy, setUserSortBy] = useState<
    "dateJoined" | "firstName" | "lastName" | "role" | "isAdmin" | "isDeleted"
  >("dateJoined");
  const [userSortDir, setUserSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please sign in to access the Admin dashboard.");
      navigate("/auth");
      return;
    }
    if (user && user.role !== "admin") {
      const destination = user.role === "freelancer" ? "/freelancer" : "/user";
      toast.info(
        user.role === "freelancer"
          ? "Redirecting to the Freelancer dashboard."
          : "Redirecting to the Buyer dashboard."
      );
      navigate(destination);
    }
    // Fetch admin overview metrics
    void reloadOverview();
    (async () => {
      try {
        const data = await adminListApplicationsApi("PENDING");
        setApplications(data.applications || []);
      } catch {
        setApplications([]);
      }
    })();
  }, [isAuthenticated, user, navigate]);

  async function reloadOverview() {
    try {
      const o = await getAdminOverviewApi();
      setOverview(o);
    } catch {
      setOverview({
        users: 0,
        freelancers: 0,
        designs: 0,
        orders: 0,
        pendingApprovals: 0,
      });
    }
  }

  useEffect(() => {
    if (
      activeTab === "users" &&
      usersData === null &&
      isAuthenticated &&
      user?.role === "admin"
    ) {
      void reloadUsers();
    }
  }, [activeTab, isAuthenticated, user, usersData]);

  // Debounce search inputs
  useEffect(() => {
    const t = setTimeout(() => setAppSearchDebounced(appSearch), 300);
    return () => clearTimeout(t);
  }, [appSearch]);

  useEffect(() => {
    const t = setTimeout(() => setUserSearchDebounced(userSearch), 300);
    return () => clearTimeout(t);
  }, [userSearch]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;
    void reloadApplications(appStatusFilter);
  }, [
    appSearchDebounced,
    appPage,
    appSortBy,
    appSortDir,
    appDateFrom,
    appDateTo,
    appStatusFilter,
    appPageSize,
  ]);

  // Auto reload users on debounced search, page or filters changes
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin" || activeTab !== "users")
      return;
    void reloadUsers();
  }, [
    userSearchDebounced,
    userPage,
    userRoleFilter,
    userAdminFilter,
    userActiveFilter,
    userSortBy,
    userSortDir,
    userPageSize,
  ]);

  async function reloadUsers() {
    setLoadingUsers(true);
    try {
      const data = await adminListUsersApi({
        q: userSearchDebounced,
        role: userRoleFilter === "ALL" ? undefined : userRoleFilter,
        admin:
          userAdminFilter === "ALL"
            ? undefined
            : userAdminFilter === "ADMIN"
            ? true
            : false,
        active:
          userActiveFilter === "ALL"
            ? undefined
            : userActiveFilter === "ACTIVE"
            ? true
            : false,
        page: userPage,
        pageSize: userPageSize,
        sortBy: userSortBy,
        sortDir: userSortDir,
      });
      setUsersData(data.users);
      setUserTotal(data.total);
    } catch (e) {
      setUsersData([]);
      setUserTotal(0);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleUserRole(userId: string, role: "BUYER" | "FREELANCER") {
    try {
      await adminUpdateUserRoleApi(userId, role);
      toast.success("User role updated.");
      await reloadUsers();
    } catch (e) {
      toast.error("Failed to update user role.");
    }
  }

  async function handleUserAdmin(userId: string, isAdmin: boolean) {
    try {
      await adminSetUserAdminApi(userId, isAdmin);
      toast.success("Admin status updated.");
      await reloadUsers();
    } catch (e) {
      toast.error("Failed to update admin status.");
    }
  }

  async function handleUserActive(userId: string, active: boolean) {
    try {
      await adminSetUserActiveApi(userId, active);
      toast.success(active ? "User reactivated." : "User deactivated.");
      await reloadUsers();
    } catch (e) {
      toast.error("Failed to update user status.");
    }
  }

  async function reloadApplications(
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) {
    setLoadingApps(true);
    try {
      const data = await adminListApplicationsApi(status, {
        q: appSearchDebounced,
        page: appPage,
        pageSize: appPageSize,
        sortBy: appSortBy,
        sortDir: appSortDir,
        dateFrom: appDateFrom || undefined,
        dateTo: appDateTo || undefined,
      });
      setApplications(data.applications || []);
      setAppTotal(data.total ?? 0);
    } catch (e) {
      setApplications([]);
      setAppTotal(0);
    } finally {
      setLoadingApps(false);
    }
  }

  async function handleApprove(id: string) {
    openConfirm({
      title: "Approve Application",
      message: "Are you sure you want to approve this freelancer application?",
      onConfirm: async () => {
        try {
          await adminApproveApplicationApi(id);
          toast.success("Application approved.");
          await reloadApplications(appStatusFilter);
          await reloadOverview();
        } catch (e) {
          toast.error("Failed to approve application.");
        }
      },
    });
  }

  async function handleReject(id: string) {
    openConfirm({
      title: "Reject Application",
      message:
        "Reject this freelancer application? You can’t post designs until approved.",
      onConfirm: async () => {
        try {
          await adminRejectApplicationApi(id);
          toast.success("Application rejected.");
          await reloadApplications(appStatusFilter);
          await reloadOverview();
        } catch (e) {
          toast.error("Failed to reject application.");
        }
      },
    });
  }

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  // Server-side pagination helpers
  const totalAppPages = Math.max(1, Math.ceil(appTotal / appPageSize));
  const totalUserPages = Math.max(1, Math.ceil(userTotal / userPageSize));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your T-shirt customization platform
            </p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await logoutApi();
              } catch {
                // ignore
              } finally {
                logout();
                toast.success("You have been logged out.");
                navigate("/auth");
              }
            }}
          >
            Logout
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview?.users ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Freelancers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview?.freelancers ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview?.pendingApprovals ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Designs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">
                    +3% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">
                    +20% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <div
                      key={order}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">Order #ORD-{1000 + order}</p>
                        <p className="text-sm text-muted-foreground">
                          Custom T-shirt Design
                        </p>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(applications || [])
                    .filter((a) => a.status === "PENDING")
                    .slice(0, 3)
                    .map((a: any) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">
                            {a.user?.firstName ||
                              a.user?.username ||
                              "Applicant"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {a.user?.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setDetailsApp(a);
                              setDetailsOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(a.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(a.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Freelancer Applications</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={
                      appStatusFilter === "PENDING" ? "default" : "outline"
                    }
                    onClick={async () => {
                      setAppStatusFilter("PENDING");
                      setAppPage(1);
                    }}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={
                      appStatusFilter === "APPROVED" ? "default" : "outline"
                    }
                    onClick={async () => {
                      setAppStatusFilter("APPROVED");
                      setAppPage(1);
                    }}
                  >
                    Approved
                  </Button>
                  <Button
                    variant={
                      appStatusFilter === "REJECTED" ? "default" : "outline"
                    }
                    onClick={async () => {
                      setAppStatusFilter("REJECTED");
                      setAppPage(1);
                    }}
                  >
                    Rejected
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={appSortBy}
                      onChange={(e) => {
                        setAppSortBy(e.target.value as any);
                        setAppPage(1);
                      }}
                    >
                      <option value="createdAt">Sort by Created</option>
                      <option value="status">Sort by Status</option>
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={appSortDir}
                      onChange={(e) => {
                        setAppSortDir(e.target.value as any);
                        setAppPage(1);
                      }}
                    >
                      <option value="desc">Desc</option>
                      <option value="asc">Asc</option>
                    </select>
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={appDateFrom}
                      onChange={(e) => {
                        setAppDateFrom(e.target.value);
                        setAppPage(1);
                      }}
                    />
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={appDateTo}
                      onChange={(e) => {
                        setAppDateTo(e.target.value);
                        setAppPage(1);
                      }}
                    />
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={appPageSize}
                      onChange={(e) => {
                        setAppPageSize(parseInt(e.target.value));
                        setAppPage(1);
                      }}
                    >
                      <option value={10}>10 / page</option>
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAppSearch("");
                        setAppSearchDebounced("");
                        setAppSortBy("createdAt");
                        setAppSortDir("desc");
                        setAppDateFrom("");
                        setAppDateTo("");
                        setAppStatusFilter("PENDING");
                        setAppPage(1);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      className="w-full md:w-80 border rounded px-3 py-2 text-sm bg-background"
                      placeholder="Search applications by name or email..."
                      value={appSearch}
                      onChange={(e) => {
                        setAppSearch(e.target.value);
                        setAppPage(1);
                        // reload will be triggered by debounce effect
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      {appTotal} result(s)
                    </div>
                  </div>
                </div>
                {loadingApps ? (
                  <div className="text-sm text-muted-foreground">
                    Loading applications...
                  </div>
                ) : applications === null ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No applications found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 border rounded"
                      >
                        <div>
                          <p className="font-medium">
                            {app.user?.firstName ||
                              app.user?.username ||
                              "Applicant"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {app.user?.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Status: {app.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setDetailsApp(app);
                              setDetailsOpen(true);
                            }}
                          >
                            View
                          </Button>
                          {app.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(app.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(app.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status !== "PENDING" && (
                            <Badge
                              variant={
                                app.status === "APPROVED"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {app.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={appPage <= 1}
                        onClick={async () => {
                          setAppPage((p) => Math.max(1, p - 1));
                        }}
                      >
                        Previous
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        Page {appPage} of {totalAppPages}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={appPage >= totalAppPages}
                        onClick={async () => {
                          setAppPage((p) => Math.min(totalAppPages, p + 1));
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={userRoleFilter}
                      onChange={(e) => {
                        setUserRoleFilter(e.target.value as any);
                        setUserPage(1);
                      }}
                    >
                      <option value="ALL">All Roles</option>
                      <option value="BUYER">Buyer</option>
                      <option value="FREELANCER">Freelancer</option>
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={userAdminFilter}
                      onChange={(e) => {
                        setUserAdminFilter(e.target.value as any);
                        setUserPage(1);
                      }}
                    >
                      <option value="ALL">All Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="NON_ADMIN">Non-Admin</option>
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={userActiveFilter}
                      onChange={(e) => {
                        setUserActiveFilter(e.target.value as any);
                        setUserPage(1);
                      }}
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="DEACTIVATED">Deactivated</option>
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={userSortBy}
                      onChange={(e) => {
                        setUserSortBy(e.target.value as any);
                        setUserPage(1);
                      }}
                    >
                      <option value="dateJoined">Sort by Joined</option>
                      <option value="firstName">Sort by First Name</option>
                      <option value="lastName">Sort by Last Name</option>
                      <option value="role">Sort by Role</option>
                      <option value="isAdmin">Sort by Admin</option>
                      <option value="isDeleted">Sort by Status</option>
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={userSortDir}
                      onChange={(e) => {
                        setUserSortDir(e.target.value as any);
                        setUserPage(1);
                      }}
                    >
                      <option value="desc">Desc</option>
                      <option value="asc">Asc</option>
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={userPageSize}
                      onChange={(e) => {
                        setUserPageSize(parseInt(e.target.value));
                        setUserPage(1);
                      }}
                    >
                      <option value={10}>10 / page</option>
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUserSearch("");
                        setUserSearchDebounced("");
                        setUserRoleFilter("ALL");
                        setUserAdminFilter("ALL");
                        setUserActiveFilter("ALL");
                        setUserSortBy("dateJoined");
                        setUserSortDir("desc");
                        setUserPage(1);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      className="w-full md:w-80 border rounded px-3 py-2 text-sm bg-background"
                      placeholder="Search users by name, email, or username..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setUserPage(1);
                        // reload will be triggered by debounce effect
                      }}
                    />
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {userTotal} result(s)
                    </div>
                  </div>
                </div>
                {loadingUsers ? (
                  <div className="text-sm text-muted-foreground">
                    Loading users...
                  </div>
                ) : usersData === null ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : usersData.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No users found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usersData.map((u) => {
                      const isActive = !u.isDeleted;
                      const roleLabel =
                        u.role === "FREELANCER" ? "Freelancer" : "Buyer";
                      return (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-4 border rounded"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {u.firstName?.[0]?.toUpperCase() ||
                                u.username?.[0]?.toUpperCase() ||
                                "U"}
                            </div>
                            <div>
                              <p className="font-medium">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {u.email}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={u.isAdmin ? "default" : "secondary"}
                                >
                                  {u.isAdmin ? "Admin" : "User"}
                                </Badge>
                                <Badge
                                  variant={
                                    u.role === "FREELANCER"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {roleLabel}
                                </Badge>
                                <Badge
                                  variant={isActive ? "default" : "destructive"}
                                >
                                  {isActive ? "Active" : "Deactivated"}
                                </Badge>
                                {u.verified && (
                                  <Badge variant="secondary">Verified</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                openConfirm({
                                  title: "Change Role",
                                  message: `Change role for ${u.email} to ${
                                    u.role === "FREELANCER"
                                      ? "Buyer"
                                      : "Freelancer"
                                  }?`,
                                  onConfirm: async () => {
                                    await handleUserRole(
                                      u.id,
                                      u.role === "FREELANCER"
                                        ? "BUYER"
                                        : "FREELANCER"
                                    );
                                  },
                                });
                              }}
                            >
                              Set{" "}
                              {u.role === "FREELANCER" ? "Buyer" : "Freelancer"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                openConfirm({
                                  title: u.isAdmin
                                    ? "Remove Admin"
                                    : "Make Admin",
                                  message: `${
                                    u.isAdmin ? "Remove" : "Grant"
                                  } admin for ${u.email}?`,
                                  onConfirm: async () => {
                                    await handleUserAdmin(u.id, !u.isAdmin);
                                  },
                                });
                              }}
                            >
                              {u.isAdmin ? "Remove Admin" : "Make Admin"}
                            </Button>
                            <Button
                              size="sm"
                              variant={isActive ? "destructive" : "outline"}
                              onClick={() => {
                                openConfirm({
                                  title: isActive
                                    ? "Deactivate User"
                                    : "Reactivate User",
                                  message: `${
                                    isActive ? "Deactivate" : "Reactivate"
                                  } account for ${u.email}?`,
                                  onConfirm: async () => {
                                    await handleUserActive(u.id, !u.isDeleted);
                                  },
                                });
                              }}
                            >
                              {isActive ? "Deactivate" : "Reactivate"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={userPage <= 1}
                        onClick={async () => {
                          setUserPage((p) => Math.max(1, p - 1));
                        }}
                      >
                        Previous
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        Page {userPage} of {totalUserPages}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={userPage >= totalUserPages}
                        onClick={async () => {
                          setUserPage((p) => Math.min(totalUserPages, p + 1));
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <div className="flex gap-2">
                  <Button>Process Orders</Button>
                  <Button variant="outline">Export Orders</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <div
                      key={order}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium">Order #ORD-{1000 + order}</p>
                        <p className="text-sm text-muted-foreground">
                          Customer: John Doe
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: $29.99
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            order % 3 === 0
                              ? "default"
                              : order % 3 === 1
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order % 3 === 0
                            ? "Completed"
                            : order % 3 === 1
                            ? "Processing"
                            : "Pending"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">Update Status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
                <div className="flex gap-2">
                  <Button>Add Product</Button>
                  <Button variant="outline">Bulk Import</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((product) => (
                    <div key={product} className="border rounded p-4">
                      <div className="w-full h-40 bg-muted rounded mb-3"></div>
                      <h3 className="font-medium">Basic T-Shirt</h3>
                      <p className="text-sm text-muted-foreground">
                        Cotton blend, multiple colors
                      </p>
                      <p className="font-bold mt-2">$19.99</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="freelancers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Management</CardTitle>
                <div className="flex gap-2">
                  <Button>Approve Applications</Button>
                  <Button variant="outline">Commission Settings</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((freelancer) => (
                    <div
                      key={freelancer}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          F{freelancer}
                        </div>
                        <div>
                          <p className="font-medium">Designer {freelancer}</p>
                          <p className="text-sm text-muted-foreground">
                            designer{freelancer}@example.com
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Designs: {freelancer * 8}, Sales: $
                            {freelancer * 245}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            freelancer % 2 === 0 ? "default" : "secondary"
                          }
                        >
                          {freelancer % 2 === 0 ? "Active" : "Pending"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Portfolio
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded flex items-center justify-center">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Designs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((design) => (
                      <div
                        key={design}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded"></div>
                          <div>
                            <p className="font-medium">Design {design}</p>
                            <p className="text-sm text-muted-foreground">
                              {design * 12} sales
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">${design * 89}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>System Status</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Users</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Server Load</span>
                      <Badge variant="secondary">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support Tickets</span>
                      <Badge variant="destructive">12 Open</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <ConfirmModal
          open={confirmOpen}
          title={confirmTitle}
          message={confirmMessage}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            try {
              await onConfirm?.();
            } finally {
              setConfirmOpen(false);
            }
          }}
        />
        <AppDetailsDrawer
          open={detailsOpen}
          application={detailsApp}
          onClose={() => setDetailsOpen(false)}
          onApprove={(id) => handleApprove(id)}
          onReject={(id) => handleReject(id)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
