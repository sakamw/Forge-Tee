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
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Palette,
  Upload,
  DollarSign,
  Star,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logoutApi } from "../../api/axios";

const FreelancerDashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please sign in to access the Freelancer dashboard.");
      navigate("/auth");
      return;
    }
    if (user && user.role !== "freelancer") {
      const destination = user.role === "admin" ? "/admin" : "/user";
      toast.info(
        user.role === "admin"
          ? "Redirecting to the Admin dashboard."
          : "Redirecting to the Buyer dashboard."
      );
      navigate(destination);
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || (user && user.role !== "freelancer")) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Freelancer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your designs and track your earnings
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="designs">My Designs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Designs
                  </CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+5 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,847</div>
                  <p className="text-xs text-muted-foreground">
                    +22% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Rating
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">
                    Based on 156 reviews
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Views this week</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sales this week</span>
                      <span className="font-bold">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Conversion rate</span>
                      <span className="font-bold">1.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Revenue this week</span>
                      <span className="font-bold">$276</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Designs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4].map((design) => (
                    <div key={design} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded"></div>
                      <div className="flex-1">
                        <p className="font-medium">Summer Vibes {design}</p>
                        <p className="text-sm text-muted-foreground">
                          {design * 15} sales
                        </p>
                      </div>
                      <span className="font-bold">${design * 89}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="designs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Design Portfolio</CardTitle>
                <div className="flex gap-2">
                  <Button>Upload New Design</Button>
                  <Button variant="outline">Bulk Actions</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((design) => (
                    <div key={design} className="border rounded p-4">
                      <div className="w-full h-40 bg-muted rounded mb-3 flex items-center justify-center">
                        <Palette className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium">Design {design}</h3>
                      <p className="text-sm text-muted-foreground">
                        Category: Abstract
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">{design * 45} views</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm">{design * 3} sales</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Stats
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
                <CardTitle>Design Orders</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track orders for your designs
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((order) => (
                    <div
                      key={order}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded"></div>
                        <div>
                          <p className="font-medium">
                            Order #ORD-{1000 + order}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Design: Summer Vibes {order}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {order} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order * 12}.99</p>
                        <p className="text-sm text-muted-foreground">
                          Your cut: ${(order * 12 * 0.3).toFixed(2)}
                        </p>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$847</div>
                  <p className="text-sm text-muted-foreground">
                    +22% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$234</div>
                  <Button size="sm" className="mt-2">
                    Withdraw
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Lifetime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$5,642</div>
                  <p className="text-sm text-muted-foreground">Since joining</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((earning) => (
                    <div
                      key={earning}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">
                          Design Sale #SALE-{2000 + earning}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Design: Abstract Art {earning}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: Jan {earning}, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +${earning * 8}.50
                        </p>
                        <p className="text-sm text-muted-foreground">
                          30% commission
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Design</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Share your creativity with our community
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Drop your design files here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <Button>Choose Files</Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: PNG, JPG, SVG, AI, PSD (max 10MB)
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Design Title</label>
                    <Input placeholder="Enter a catchy title for your design" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe your design, inspiration, and suggested use cases" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Input placeholder="summer, abstract, colorful, trendy (comma separated)" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full p-2 border rounded">
                      <option>Abstract</option>
                      <option>Nature</option>
                      <option>Typography</option>
                      <option>Illustration</option>
                      <option>Photography</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Suggested Price
                    </label>
                    <Input type="number" placeholder="19.99" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">Upload Design</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Profile</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your public profile and settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {user?.name?.[0] || "U"}
                    </span>
                  </div>
                  <div>
                    <Button>Change Photo</Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <Input defaultValue={user?.name || ""} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={user?.email || ""} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="City, Country" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <Input placeholder="https://yourportfolio.com" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea placeholder="Tell customers about yourself, your style, and what makes your designs special..." />
                </div>

                <div>
                  <label className="text-sm font-medium">Specialties</label>
                  <Input placeholder="Abstract art, Typography, Minimalist design" />
                </div>

                <div className="flex gap-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <select className="w-full p-2 border rounded">
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                    <option>Stripe</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">PayPal Email</label>
                  <Input placeholder="your.paypal@email.com" />
                </div>
                <Button>Update Payment Info</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
