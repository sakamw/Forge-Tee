/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  ShoppingBag,
  Heart,
  Search,
  Filter,
  Star,
  CreditCard,
  User,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  logoutApi,
  getBuyerOrdersApi,
  getMarketplaceDesignsApi,
  MarketplaceDesign,
} from "../../api/axios";

const DEFAULT_MARKETPLACE_PAGE_SIZE = 12;

const MARKETPLACE_CATEGORIES = [
  "All",
  "Abstract",
  "Nature",
  "Typography",
  "Illustration",
  "Photography",
  "Minimalist",
  "Vintage",
  "Pop Culture",
];

const MARKETPLACE_SORT_OPTIONS: Array<{
  label: string;
  sortBy: "createdAt" | "price" | "rating" | "favorites";
  sortDir: "asc" | "desc";
}> = [
  { label: "Newest", sortBy: "createdAt", sortDir: "desc" },
  { label: "Oldest", sortBy: "createdAt", sortDir: "asc" },
  { label: "Price: Low to High", sortBy: "price", sortDir: "asc" },
  { label: "Price: High to Low", sortBy: "price", sortDir: "desc" },
  { label: "Top Rated", sortBy: "rating", sortDir: "desc" },
  { label: "Most Favorited", sortBy: "favorites", sortDir: "desc" },
];

const BuyerDashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [orders, setOrders] = useState<any[] | null>(null);
  const [marketplaceState, setMarketplaceState] = useState<{
    designs: MarketplaceDesign[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>(() => ({
    designs: [],
    total: 0,
    totalPages: 0,
    page: 1,
    pageSize: DEFAULT_MARKETPLACE_PAGE_SIZE,
  }));
  const [marketplaceError, setMarketplaceError] = useState<string | null>(null);
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
  const [isMarketplaceLoadingMore, setIsMarketplaceLoadingMore] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "price" | "rating" | "favorites"
  >("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const marketplaceRequestIdRef = useRef(0);

  const sortLabel = useMemo(() => {
    const match = MARKETPLACE_SORT_OPTIONS.find(
      (option) => option.sortBy === sortBy && option.sortDir === sortDir
    );
    return match?.label ?? MARKETPLACE_SORT_OPTIONS[0]?.label ?? "Newest";
  }, [sortBy, sortDir]);

  const fetchMarketplacePage = useCallback(
    async (pageToFetch: number, append = false) => {
      if (!isAuthenticated || (user && user.role !== "buyer")) {
        return;
      }

      const requestId = ++marketplaceRequestIdRef.current;

      if (!append) {
        setIsMarketplaceLoading(true);
        setMarketplaceState((prev) => ({
          ...prev,
          designs: [],
          page: pageToFetch,
        }));
      } else {
        setIsMarketplaceLoadingMore(true);
      }

      setMarketplaceError(null);

      try {
        const response = await getMarketplaceDesignsApi({
          q: searchTerm.trim() || undefined,
          category:
            selectedCategory === "All" ? undefined : selectedCategory,
          page: pageToFetch,
          pageSize: DEFAULT_MARKETPLACE_PAGE_SIZE,
          sortBy,
          sortDir,
        });

        if (requestId !== marketplaceRequestIdRef.current) {
          return;
        }

        setMarketplaceState((prev) => ({
          designs: append
            ? [...prev.designs, ...response.designs]
            : response.designs,
          total: response.total,
          totalPages: response.totalPages,
          page: response.page,
          pageSize: response.pageSize,
        }));
        setMarketplaceError(null);
      } catch (error) {
        if (requestId !== marketplaceRequestIdRef.current) {
          return;
        }
        console.error("Failed to load marketplace designs", error);
        setMarketplaceError(
          "Unable to load marketplace designs. Please try again."
        );
      } finally {
        if (requestId === marketplaceRequestIdRef.current) {
          if (append) {
            setIsMarketplaceLoadingMore(false);
          } else {
            setIsMarketplaceLoading(false);
          }
        }
      }
    },
    [isAuthenticated, user, searchTerm, selectedCategory, sortBy, sortDir]
  );

  const handleLoadMoreDesigns = useCallback(() => {
    if (
      isMarketplaceLoadingMore ||
      marketplaceState.page >= marketplaceState.totalPages
    ) {
      return;
    }

    fetchMarketplacePage(marketplaceState.page + 1, true);
  }, [
    fetchMarketplacePage,
    isMarketplaceLoadingMore,
    marketplaceState.page,
    marketplaceState.totalPages,
  ]);

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== "buyer")) {
      return;
    }

    const debounce = setTimeout(() => {
      fetchMarketplacePage(1, false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [fetchMarketplacePage, isAuthenticated, user]);

  const hasMoreMarketplaceDesigns =
    marketplaceState.page < marketplaceState.totalPages;
  const showMarketplaceEmptyState =
    !isMarketplaceLoading &&
    marketplaceState.designs.length === 0 &&
    !marketplaceError;
  const showMarketplaceSkeleton =
    isMarketplaceLoading && marketplaceState.designs.length === 0;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please sign in to access your dashboard.");
      navigate("/auth");
      return;
    }
    if (user && user.role !== "buyer") {
      const destination = user.role === "admin" ? "/admin" : "/freelancer";
      toast.info(
        user.role === "admin"
          ? "Redirecting to the Admin dashboard."
          : "Redirecting to the Freelancer dashboard."
      );
      navigate(destination);
    }
    // Fetch buyer orders for the Orders tab
    (async () => {
      try {
        const data = await getBuyerOrdersApi();
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      }
    })();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || (user && user.role !== "buyer")) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Buyer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Discover amazing designs and customize your perfect T-shirt
            </p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await logoutApi();
              } catch {
                // ignore network errors on logout
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
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search designs or designers..."
                      className="pl-10"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="justify-between min-w-[220px]">
                        <span className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{sortLabel}</span>
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      {MARKETPLACE_SORT_OPTIONS.map((option) => {
                        const isActive =
                          option.sortBy === sortBy && option.sortDir === sortDir;
                        return (
                          <DropdownMenuItem
                            key={`${option.sortBy}-${option.sortDir}`}
                            className={isActive ? "text-primary font-medium" : ""}
                            onSelect={() => {
                              setSortBy(option.sortBy);
                              setSortDir(option.sortDir);
                            }}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {MARKETPLACE_CATEGORIES.map((category) => {
                      const isActive = selectedCategory === category;
                      return (
                        <Button
                          key={category}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (isActive) return;
                            setSelectedCategory(category);
                          }}
                        >
                          {category}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {showMarketplaceSkeleton ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: DEFAULT_MARKETPLACE_PAGE_SIZE }).map(
                      (_item, index) => (
                        <div
                          key={`marketplace-skeleton-${index}`}
                          className="border rounded-lg overflow-hidden animate-pulse"
                        >
                          <div className="w-full h-48 bg-muted" />
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-muted rounded" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : marketplaceError ? (
                  <div className="p-6 border rounded text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      {marketplaceError}
                    </p>
                    <Button onClick={() => fetchMarketplacePage(1, false)}>
                      Try Again
                    </Button>
                  </div>
                ) : showMarketplaceEmptyState ? (
                  <div className="p-6 border rounded text-center text-muted-foreground">
                    No designs found. Try adjusting your filters or search
                    terms.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {marketplaceState.designs.map((design) => {
                        const priceValue = Number(design.price);
                        const formattedPrice = Number.isFinite(priceValue)
                          ? `$${priceValue.toFixed(2)}`
                          : "$0.00";
                        const designerName = design.designer
                          ? [design.designer.firstName, design.designer.lastName]
                              .filter(Boolean)
                              .join(" ") || design.designer.username
                          : "Community Designer";

                        return (
                          <div
                            key={design.id}
                            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="relative">
                              {design.imageUrl ? (
                                <img
                                  src={design.imageUrl}
                                  alt={design.title}
                                  className="h-48 w-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center text-center px-6">
                                  <span className="text-muted-foreground text-sm">
                                    {design.title}
                                  </span>
                                </div>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2 w-8 h-8 p-0"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="p-4 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {design.title}
                                </h3>
                                {design.description && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {design.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{design.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">
                                  ({design.reviewCount}{" "}
                                  {design.reviewCount === 1
                                    ? "review"
                                    : "reviews"})
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                by {designerName}
                              </p>
                              {design.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {design.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="outline">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-1">
                                <span className="font-bold text-base">
                                  {formattedPrice}
                                </span>
                                <Button size="sm">Customize</Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {hasMoreMarketplaceDesigns && (
                      <div className="flex justify-center mt-8">
                        <Button
                          variant="outline"
                          onClick={handleLoadMoreDesigns}
                          disabled={isMarketplaceLoadingMore}
                        >
                          {isMarketplaceLoadingMore ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load More Designs"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
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
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track your recent purchases and order status
                </p>
              </CardHeader>
              <CardContent>
                {orders === null ? (
                  <div className="text-sm text-muted-foreground">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-6 border rounded text-center text-muted-foreground">
                    No orders yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o: any) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between p-4 border rounded"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded" />
                          <div>
                            <p className="font-medium">
                              Order #{o.code || o.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Design: {o.designTitle || "T-shirt"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {o.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {o.total ? `$${o.total}` : "$0.00"}
                          </p>
                          <Badge variant="secondary">
                            {o.status || "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
