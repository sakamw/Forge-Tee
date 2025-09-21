import { useState } from "react";
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
import {
  Users,
  ShoppingBag,
  Palette,
  DollarSign,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  if (user?.role !== "admin") {
    return (
      <div className="p-8 text-center">
        Access denied. Admin privileges required.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your T-shirt customization platform
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Freelancers
                  </CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
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
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">Freelancer Application</p>
                        <p className="text-sm text-muted-foreground">
                          John Designer
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <Button>Add User</Button>
                  <Button variant="outline">Export Users</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((user) => (
                    <div
                      key={user}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          U{user}
                        </div>
                        <div>
                          <p className="font-medium">User {user}</p>
                          <p className="text-sm text-muted-foreground">
                            user{user}@example.com
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={user % 2 === 0 ? "default" : "secondary"}
                        >
                          {user % 2 === 0 ? "Buyer" : "Freelancer"}
                        </Badge>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
