"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "@workspace/types/forms";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Loader2, Shield, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<
    "officer" | "analyst" | "prosecutor" | "admin" | "citizen"
  >("officer");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Demo credentials
  const demoCredentials = {
    officer: {
      email: "martinez@plaza.gov",
      password: "password123",
      name: "Officer Sarah Martinez",
    },
    analyst: {
      email: "analyst@plaza.gov",
      password: "password123",
      name: "Dr. Emily Watson",
    },
    prosecutor: {
      email: "prosecutor@plaza.gov",
      password: "password123",
      name: "James Wilson",
    },
    admin: {
      email: "admin@plaza.gov",
      password: "password123",
      name: "Admin User",
    },
    citizen: {
      email: "john.doe@email.com",
      password: "password123",
      name: "John Doe",
    },
  };

  const fillDemoCredentials = (role: keyof typeof demoCredentials) => {
    const creds = demoCredentials[role];
    setValue("email", creds.email);
    setValue("password", creds.password);
    setSelectedRole(role);
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password"
      );
    }
  };

  const roleColors = {
    officer: "bg-blue-500",
    analyst: "bg-teal-500",
    prosecutor: "bg-purple-500",
    admin: "bg-gray-500",
    citizen: "bg-green-500",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">PLAZA Toolkit</h1>
          <p className="text-gray-600 mt-2">
            Environmental Incident Investigation Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Demo Accounts Tabs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Quick access with demo accounts:
              </p>
              <Tabs
                value={selectedRole}
                onValueChange={(v) =>
                  setSelectedRole(
                    v as
                      | "officer"
                      | "analyst"
                      | "prosecutor"
                      | "admin"
                      | "citizen"
                  )
                }
              >
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
                  <TabsTrigger
                    value="officer"
                    onClick={() => fillDemoCredentials("officer")}
                    className="text-xs"
                  >
                    Officer
                  </TabsTrigger>
                  <TabsTrigger
                    value="analyst"
                    onClick={() => fillDemoCredentials("analyst")}
                    className="text-xs"
                  >
                    Analyst
                  </TabsTrigger>
                  <TabsTrigger
                    value="prosecutor"
                    onClick={() => fillDemoCredentials("prosecutor")}
                    className="text-xs"
                  >
                    Prosecutor
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    onClick={() => fillDemoCredentials("admin")}
                    className="text-xs"
                  >
                    Admin
                  </TabsTrigger>
                  <TabsTrigger
                    value="citizen"
                    onClick={() => fillDemoCredentials("citizen")}
                    className="text-xs"
                  >
                    Citizen
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={selectedRole} className="mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`${roleColors[selectedRole]} text-white`}
                      >
                        {selectedRole.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">
                        {demoCredentials[selectedRole].name}
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-xs text-gray-500 text-center w-full">
              This is a demo environment. Use the quick access buttons above to
              sign in with different roles.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
