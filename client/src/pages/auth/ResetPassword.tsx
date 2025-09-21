import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { resetPasswordVerifyApi, resetPasswordApi } from "../../api/axios";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { id = "", token = "" } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Verify reset link first
    async function verify() {
      if (!id || !token) {
        setIsVerifying(false);
        toast.error("Invalid reset link.");
        navigate("/auth");
        return;
      }
      try {
        await resetPasswordVerifyApi(id, token);
      } catch {
        toast.error("Reset link is invalid or expired.");
        navigate("/auth");
      } finally {
        setIsVerifying(false);
      }
    }
    verify();
  }, [id, token, navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      if (!id || !token) throw new Error("Invalid reset link");
      await resetPasswordApi(id, token, { password });
      toast.success("Your password has been reset successfully.");
      navigate("/auth");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset password.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card shadow-xl border border-border rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={isLoading || isVerifying}
              >
                {isVerifying ? "Verifying..." : isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-muted-foreground"
              >
                ← Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
