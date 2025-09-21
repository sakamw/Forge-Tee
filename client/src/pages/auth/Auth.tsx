import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  Palette,
  User,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { registerApi, loginApi } from "../../api/axios";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "../../components/ui/sonner";

interface FormData {
  // Sign in
  identifier: string; // email or username
  password: string;
  // Sign up
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  confirmPassword: string;
  role: "buyer" | "freelancer";
}

interface FormErrors {
  identifier?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    confirmPassword: "",
    role: "buyer",
  });

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePassword = (
    password: string
  ): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      };
    }
    return { isValid: true };
  };

  // Form validation
  const validateForm = (type: "signin" | "signup"): boolean => {
    const newErrors: FormErrors = {};

    if (type === "signin") {
      if (!formData.identifier.trim()) {
        newErrors.identifier = "Email or username is required";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    } else {
      // signup
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.username.trim()) newErrors.username = "Username is required";

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          newErrors.password = passwordValidation.message;
        }
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (type: "signin" | "signup") => {
    if (!validateForm(type)) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      if (type === "signup") {
        await registerApi({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        setSuccessMessage(
          "Registration successful! Please check your email to activate your account."
        );
        // Send user to activation instructions with email in query
        navigate(
          `/activation-instructions?email=${encodeURIComponent(formData.email)}`
        );
        return;
      }

      // Sign in
      const userDetails = await loginApi({
        identifier: formData.identifier,
        password: formData.password,
      });

      setSuccessMessage("Welcome back!");

      // Redirect logic based on server-provided role (not form state)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isAdmin = (userDetails as any)?.isAdmin === true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverRoleRaw = ((userDetails as any)?.role ?? "").toString().toLowerCase();
      const resolvedRole: "buyer" | "freelancer" | "admin" = isAdmin
        ? "admin"
        : serverRoleRaw === "freelancer"
        ? "freelancer"
        : "buyer";

      // Persist auth state for protected routes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const first = (userDetails as any)?.firstName as string | undefined;
      const last = (userDetails as any)?.lastName as string | undefined;
      const username = (userDetails as any)?.username as string | undefined;
      const fullName = [first, last].filter(Boolean).join(" ");
      login({
        id: String((userDetails as any)?.id || ""),
        name: fullName || String(username || "User"),
        email: String((userDetails as any)?.email || formData.identifier || ""),
        role: resolvedRole,
        avatar: (userDetails as any)?.avatar || undefined,
        createdAt: String((userDetails as any)?.dateJoined || new Date().toISOString()),
      });
      const displayName = (fullName || username || "there") as string;
      toast.success(`Welcome back, ${displayName}!`);

      // Determine destination based on resolved role
      const destination =
        resolvedRole === "admin"
          ? "/admin"
          : resolvedRole === "freelancer"
          ? "/freelancer"
          : "/user";
      const destLabel =
        resolvedRole === "admin"
          ? "Admin dashboard"
          : resolvedRole === "freelancer"
          ? "Freelancer dashboard"
          : "Buyer dashboard";
      toast.info(`Redirecting to your ${destLabel}...`);
      setTimeout(() => {
        navigate(destination);
      }, 1500);
    } catch (error) {
      let friendly = "Something went wrong. Please try again.";
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const serverMsg = (error.response?.data as { message?: string } | undefined)?.message;
        if (type === "signin") {
          if (status === 0 || !status) {
            friendly = "Unable to reach the server. Please check your internet connection and try again.";
          } else if (status === 400) {
            friendly = serverMsg || "Invalid email/username or password.";
          } else if (status === 403) {
            friendly = serverMsg || "Your account is not activated yet. Please check your email for the activation link.";
          } else if (status && status >= 500) {
            friendly = "Server error. Please try again in a moment.";
          } else {
            friendly = serverMsg || "Sign in failed. Please try again.";
          }
        } else {
          // signup
          if (status === 0 || !status) {
            friendly = "Unable to reach the server. Please check your internet connection and try again.";
          } else if (status === 400) {
            friendly = serverMsg || "Email or username already in use, or password too weak.";
          } else if (status && status >= 500) {
            friendly = serverMsg || "Server error during registration. Please try again later.";
          } else {
            friendly = serverMsg || "Registration failed. Please review your details and try again.";
          }
        }
      } else if (error instanceof Error) {
        friendly = error.message;
      }
      setErrors({ general: friendly });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear field-specific errors when user starts typing
    if (field in errors) {
      setErrors({ ...errors, [field as keyof FormErrors]: undefined });
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };

    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];

    strength = checks.filter(Boolean).length;

    if (strength < 3) return { strength, label: "Weak", color: "text-red-500" };
    if (strength < 4)
      return { strength, label: "Medium", color: "text-yellow-500" };
    return { strength, label: "Strong", color: "text-green-500" };
  };

  const roleOptions = [
    {
      value: "buyer" as const,
      label: "Buyer",
      description: "I want to create and order custom t-shirts",
      icon: User,
    },
    {
      value: "freelancer" as const,
      label: "Freelancer/Seller",
      description: "I want to sell designs and offer services",
      icon: Users,
    },
  ];

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Custom Tee
          </span>
        </div>

        <div className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account or create a new one
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "signin"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "signup"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("signin");
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="signin-identifier"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email or Username
                </label>
                <input
                  id="signin-identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange("identifier", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.identifier
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                {errors.identifier && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signin-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary hover:opacity-90 disabled:opacity-50 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("signup");
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.firstName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.lastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.username ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.password && passwordStrength.label && (
                  <div className="flex items-center justify-between text-sm">
                    <span className={passwordStrength.color}>
                      Password strength: {passwordStrength.label}
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-4 rounded ${
                            i < passwordStrength.strength
                              ? passwordStrength.strength < 3
                                ? "bg-red-500"
                                : passwordStrength.strength < 4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose your role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange("role", option.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.role === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <option.icon
                          className={`w-4 h-4 ${
                            formData.role === option.value
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary hover:opacity-90 disabled:opacity-50 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              ← Back to Home
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By continuing, you agree to TeeCustom's{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
