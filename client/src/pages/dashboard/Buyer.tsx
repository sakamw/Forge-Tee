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
import { Input } from "../../components/ui/input";
import {
  ShoppingBag,
  Heart,
  Search,
  Filter,
  Star,
  CreditCard,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("marketplace");

  if (user?.role !== "buyer") {
    return (
      <div className="p-8 text-center">
        Access denied. Buyer account required.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Buyer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Discover amazing designs and customize your perfect T-shirt
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="designer">Designer Tool</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Marketplace</CardTitle>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search designs..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "All",
                      "Abstract",
                      "Nature",
                      "Typography",
                      "Illustration",
                      "Photography",
                      "Minimalist",
                    ].map((category) => (
                      <Button key={category} variant="outline" size="sm">
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((design) => (
                    <div
                      key={design}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">
                            Design {design}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 w-8 h-8 p-0"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">
                          Summer Vibes {design}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by Designer{design}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.{design % 10}</span>
                          <span className="text-sm text-muted-foreground">
                            ({design * 3} reviews)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">${design + 15}.99</span>
                          <Button size="sm">Customize</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button variant="outline">Load More Designs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">19</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$487</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((order) => (
                    <div
                      key={order}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded"></div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          Order #ORD-{1000 + order}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Custom T-shirt - Summer Vibes {order}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ordered: Jan {order}, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order + 19}.99</p>
                        <Badge
                          variant={
                            order % 4 === 0
                              ? "default"
                              : order % 4 === 1
                              ? "secondary"
                              : order % 4 === 2
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {order % 4 === 0
                            ? "Delivered"
                            : order % 4 === 1
                            ? "Shipped"
                            : order % 4 === 2
                            ? "Processing"
                            : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          Track Order
                        </Button>
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Favorite Designs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Designs you've saved for later
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((design) => (
                    <div
                      key={design}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="relative">
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">
                            Favorite {design}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 w-8 h-8 p-0"
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">
                          Favorite Design {design}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by Designer{design}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">${design + 20}.99</span>
                          <Button size="sm">Customize</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="designer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>T-Shirt Designer Tool</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create your own custom design or start with a template
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Start from Scratch
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use our design tools to create your unique T-shirt design
                    </p>
                    <Button onClick={() => navigate("/designer")}>
                      Open Designer
                    </Button>
                  </div>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Browse Templates
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose from hundreds of pre-made designs and customize
                      them
                    </p>
                    <Button variant="outline">View Templates</Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-4">Your Recent Designs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((design) => (
                      <div key={design} className="border rounded p-4">
                        <div className="w-full h-32 bg-muted rounded mb-3"></div>
                        <h4 className="font-medium">My Design {design}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last edited: {design} days ago
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm">Order</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
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
                    <label className="text-sm font-medium">First Name</label>
                    <Input defaultValue="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input defaultValue="Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={user?.email || ""} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Home Address</span>
                    <Badge>Default</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    123 Main Street
                    <br />
                    Apartment 4B
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </div>
                <Button variant="outline">Add New Address</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">•••• •••• •••• 1234</span>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </div>
                <Button variant="outline">Add New Card</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="font-medium mb-1">
                      How long does shipping take?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Standard shipping takes 5-7 business days. Express
                      shipping is available for 2-3 days.
                    </p>
                  </div>
                  <div className="border-b pb-3">
                    <h3 className="font-medium mb-1">
                      Can I return my custom T-shirt?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can return items within 30 days if there are
                      quality issues.
                    </p>
                  </div>
                  <div className="border-b pb-3">
                    <h3 className="font-medium mb-1">
                      What file formats do you accept?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We accept PNG, JPG, SVG, AI, and PSD files up to 10MB.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full p-3 border rounded-md h-32"
                      placeholder="Describe your issue or question..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Order Number (if applicable)
                    </label>
                    <Input placeholder="ORD-1001" />
                  </div>
                  <Button className="w-full">Send Message</Button>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Other ways to reach us:
                    </p>
                    <p className="text-sm">📧 support@tshirtdesigner.com</p>
                    <p className="text-sm">📞 1-800-TSHIRT</p>
                    <p className="text-sm">
                      💬 Live chat (bottom right corner)
                    </p>
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

export default BuyerDashboard;
