import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast } from "sonner";
import { resendActivationApi } from "../../api/axios";

const ActivationInstructions: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const em = params.get("email") || "";
    setEmail(em);
  }, [params]);

  async function handleResend() {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }
    setLoading(true);
    try {
      await resendActivationApi({ email });
      toast.success("Activation email resent. Check your inbox.");
    } catch (e: unknown) {
      const msg = (e as Error)?.message || "Failed to resend activation email.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-xl">
        <Card className="bg-card shadow-xl border border-border rounded-2xl">
          <CardHeader>
            <CardTitle>Verify your email to activate your account</CardTitle>
            <CardDescription>
              We&apos;ve sent an activation link to{" "}
              {email ? (
                <span className="font-medium">{email}</span>
              ) : (
                "your email"
              )}
              . Click the link in the email to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  It can take up to a few minutes for the email to arrive.
                </li>
                <li>
                  Check your spam or junk folder if you don&apos;t see it.
                </li>
                <li>
                  The link expires in 24 hours; you can request a new one
                  anytime.
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={handleResend} disabled={loading}>
                  {loading ? "Resending..." : "Resend activation email"}
                </Button>
                <Button variant="secondary" onClick={() => navigate("/auth")}>
                  Back to Login
                </Button>
                <Button variant="secondary" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivationInstructions;
