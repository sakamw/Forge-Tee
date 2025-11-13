import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, IText } from "fabric";
import { useDesignStore } from "../../store/useDesignStore";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { RotateCcw, Download, Save } from "lucide-react";
import { toast } from "sonner";

interface TShirtCanvasProps {
  width?: number;
  height?: number;
}

export const TShirtCanvas: React.FC<TShirtCanvasProps> = ({
  width = 400,
  height = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentDesign, updateCurrentDesign } = useDesignStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#f8f9fa",
      selection: true,
    });

    // Add T-shirt outline
    const tshirtPath = new Rect({
      left: 50,
      top: 50,
      width: width - 100,
      height: height - 100,
      fill: currentDesign.color || "#ffffff",
      stroke: "#e0e0e0",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      rx: 20,
      ry: 20,
    });

    canvas.add(tshirtPath);
    canvas.renderAll();

    setFabricCanvas(canvas);
    setIsLoading(false);
    toast.success("Design canvas ready!");

    return () => {
      canvas.dispose();
    };
  }, [width, height, currentDesign.color]);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Update t-shirt color when design changes
    const tshirtBg = fabricCanvas.getObjects()[0];
    if (tshirtBg && currentDesign.color) {
      tshirtBg.set("fill", currentDesign.color);
      fabricCanvas.renderAll();
    }
  }, [currentDesign.color, fabricCanvas]);

  const addText = () => {
    if (!fabricCanvas) return;

    const text = new IText("Your Text Here", {
      left: 150,
      top: 200,
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#000000",
      textAlign: "center",
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    toast.success("Text added! Double-click to edit.");
  };

  const addShape = (shape: "circle" | "rectangle") => {
    if (!fabricCanvas) return;

    let obj;
    if (shape === "circle") {
      obj = new Circle({
        left: 150,
        top: 150,
        radius: 30,
        fill: "#50207A",
        stroke: "#838CE5",
        strokeWidth: 2,
      });
    } else {
      obj = new Rect({
        left: 150,
        top: 150,
        width: 60,
        height: 60,
        fill: "#50207A",
        stroke: "#838CE5",
        strokeWidth: 2,
      });
    }

    fabricCanvas.add(obj);
    fabricCanvas.setActiveObject(obj);
    fabricCanvas.renderAll();
    toast.success(`${shape} added to design!`);
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    // Keep the first object (t-shirt background)
    objects.slice(1).forEach((obj) => fabricCanvas.remove(obj));
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const saveDesign = () => {
    if (!fabricCanvas) return;

    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    // Save to the backend
    updateCurrentDesign({
      frontDesign: dataURL,
    });

    toast.success("Design saved successfully!");
  };

  const downloadDesign = () => {
    if (!fabricCanvas) return;

    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = "tshirt-design.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Design downloaded!");
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card border-0">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Canvas Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Live Preview</Badge>
              <span className="text-sm text-muted-foreground">
                Design your perfect t-shirt
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>

              <Button variant="outline" size="sm" onClick={saveDesign}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>

              <Button
                size="sm"
                onClick={downloadDesign}
                className="gradient-primary"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border border-border rounded-lg shadow-md max-w-full"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={addText}>
              Add Text
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("circle")}
            >
              Add Circle
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("rectangle")}
            >
              Add Rectangle
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Click and drag to move objects</p>
            <p>• Double-click text to edit</p>
            <p>• Use corner handles to resize</p>
            <p>• Right-click for more options</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
