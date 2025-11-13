/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Header } from "../components/layout/Header";
import { TShirtCanvas } from "../components/designer/TShirtCanvas";
import { useDesignStore } from "../store/useDesignStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Palette, Shirt, Package, Sparkles } from "lucide-react";

export const Designer: React.FC = () => {
  const { currentDesign, updateCurrentDesign } = useDesignStore();

  const colors = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Navy", value: "#1e3a8a" },
    { name: "Red", value: "#dc2626" },
    { name: "Green", value: "#16a34a" },
    { name: "Purple", value: "#9333ea" },
    { name: "Pink", value: "#ec4899" },
    { name: "Yellow", value: "#eab308" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const styles = [
    { value: "crew-neck", label: "Crew Neck" },
    { value: "v-neck", label: "V-Neck" },
    { value: "tank-top", label: "Tank Top" },
    { value: "long-sleeve", label: "Long Sleeve" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Design Canvas */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">T-Shirt Designer</h1>
                <p className="text-muted-foreground">
                  Create your perfect custom t-shirt with our live preview
                  editor
                </p>
              </div>

              <TShirtCanvas width={500} height={600} />
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* T-Shirt Options */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shirt className="w-5 h-5" />
                  <span>T-Shirt Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          updateCurrentDesign({ color: color.value })
                        }
                        className={`w-12 h-12 rounded-lg border-2 transition-smooth ${
                          currentDesign.color === color.value
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected:{" "}
                    {colors.find((c) => c.value === currentDesign.color)
                      ?.name || "Custom"}
                  </p>
                </div>

                <Separator />

                {/* Size Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Size</Label>
                  <Select
                    value={currentDesign.size}
                    onValueChange={(value) =>
                      updateCurrentDesign({ size: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Style Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Style</Label>
                  <Select
                    value={currentDesign.style}
                    onValueChange={(value) =>
                      updateCurrentDesign({ style: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Design Tools */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Design Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upload Image
                  <Badge variant="secondary" className="ml-auto">
                    Soon
                  </Badge>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Browse Templates
                  <Badge variant="secondary" className="ml-auto">
                    Soon
                  </Badge>
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p>More design tools coming soon:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Image upload & editing</li>
                    <li>Pre-made templates</li>
                    <li>Advanced text effects</li>
                    <li>Layer management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Price:</span>
                    <span>$19.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Custom Design:</span>
                    <span>$5.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>$24.99</span>
                  </div>
                </div>

                <Button className="w-full gradient-primary" size="lg" disabled>
                  Add to Cart
                  <Badge variant="secondary" className="ml-2">
                    Soon
                  </Badge>
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  E-commerce functionality coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designer;
