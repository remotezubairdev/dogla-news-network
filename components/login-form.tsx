"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/protected");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-10",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-red-600">
              DNN • LIVE
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#0B1F3A]">
            DOGLA NEWS
          </h1>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Dogla News Network
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 bg-white shadow-xl">

          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-black text-[#0B1F3A]">
              Welcome Back, Reporter
            </CardTitle>

            <CardDescription className="text-slate-500">
              Sign in to access the Dogla News Network.
            </CardDescription>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-5">

                {/* Email */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="font-semibold text-[#0B1F3A]"
                  >
                    Reporter Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="reporter@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-[#0B1F3A]"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">

                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="font-semibold text-[#0B1F3A]"
                    >
                      Password
                    </Label>

                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-[#2F80ED] underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-[#0B1F3A]"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Login */}
                <Button
                  type="submit"
                  className="w-full bg-[#0B1F3A] font-bold text-white hover:bg-[#123B68]"
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting to DNN..." : "Enter Newsroom"}
                </Button>

              </div>

              {/* Sign Up */}
              <div className="mt-5 text-center text-sm text-slate-500">
                Not a reporter yet?{" "}
                <Link
                  href="/auth/sign-up"
                  className="font-semibold text-[#2F80ED] underline-offset-4 hover:underline"
                >
                  Join Dogla News
                </Link>
              </div>
            </form>

          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            DOGla NEWS NETWORK • DNN
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your trusted source for completely questionable journalism.
          </p>
        </div>

      </div>
    </div>
  );
}