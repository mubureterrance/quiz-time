import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "Registration failed. Please try again.";
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  // Auto-clear error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      if (!displayName.trim() || !email.trim() || !password.trim()) {
        throw new Error("Please fill in all fields.");
      }
      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      // Firebase auth create user
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Optionally set displayName on Firebase Auth profile
      if (displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() });
      }

      // Create user document in Firestore with default role
      const profileRef = doc(db, "users", user.uid);
      await setDoc(profileRef, {
        displayName: displayName.trim(),
        email: email.trim(),
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // Redirect or show success
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Registration error:", err);
      // If it's a Firebase error with code
      if (err.code) {
        setError(getErrorMessage(err.code));
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    if (password.length < 6) return { strength: "weak", color: "bg-red-500" };
    if (password.length < 8)
      return { strength: "medium", color: "bg-yellow-500" };
    return { strength: "strong", color: "bg-green-500" };
  })();

  const isFormValid =
    displayName.trim() &&
    email.trim() &&
    password.length >= 6 &&
    isValidEmail(email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join us and start your journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Display Name */}
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "displayName"
                    ? "text-indigo-500"
                    : "text-gray-400"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Display Name"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                  focusedField === "displayName"
                    ? "border-indigo-500 bg-white shadow-lg transform scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onFocus={() => setFocusedField("displayName")}
                onBlur={() => setFocusedField("")}
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "email" ? "text-indigo-500" : "text-gray-400"
                }`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                  focusedField === "email"
                    ? "border-indigo-500 bg-white shadow-lg transform scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "password"
                    ? "text-indigo-500"
                    : "text-gray-400"
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                  focusedField === "password"
                    ? "border-indigo-500 bg-white shadow-lg transform scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword((s) => !s)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Strength */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Password strength:</span>
                  <span
                    className={`font-medium ${
                      passwordStrength.strength === "weak"
                        ? "text-red-500"
                        : passwordStrength.strength === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {passwordStrength.strength[0].toUpperCase() +
                      passwordStrength.strength.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{
                      width:
                        passwordStrength.strength === "weak"
                          ? "33%"
                          : passwordStrength.strength === "medium"
                          ? "66%"
                          : "100%",
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
