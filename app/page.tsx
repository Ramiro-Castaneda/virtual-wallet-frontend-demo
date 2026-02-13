"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function validate() {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Left panel - branding */}
      <div className="hidden flex-1 flex-col justify-between bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wallet className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            VaultPay
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight text-sidebar-foreground text-balance">
            Manage your money with confidence and clarity.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-sidebar-foreground/60">
            Send, receive, and track every transaction in one secure place.
            Built for teams and individuals who demand reliability.
          </p>
        </div>

        <p className="text-xs text-sidebar-foreground/40">
          VaultPay Inc. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center bg-card px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              VaultPay
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={
                    errors.password
                      ? "border-destructive pr-10 focus-visible:ring-destructive"
                      : "pr-10"
                  }
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-1 h-11 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="text-primary-foreground" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
