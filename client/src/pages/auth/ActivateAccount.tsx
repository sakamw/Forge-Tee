import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast } from "sonner";

const ActivateAccount: React.FC = () => {
  const { id = "", token = "" } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !token) return;

    const apiBase =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((import.meta as any).env?.VITE_API_URL as string) ||
      "http://localhost:4301/api";

    fetch(
      `${apiBase}/auth/activate/${encodeURIComponent(id)}/${encodeURIComponent(
        token
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Activation failed");
        toast.success("Your account has been activated successfully!");
        navigate("/auth");
      })
      .catch(() => {
        toast.error("Activation link is invalid or expired.");
        navigate("/activation-instructions");
      });
  }, [id, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card shadow-xl border border-border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center">
              Activating your account...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Please wait while we verify your activation link.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivateAccount;
