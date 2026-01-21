"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/* ---------------- Zod Schema ---------------- */
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().min(8, "At least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const loginSubmit = (data: FormData) => {
    console.log("Login clicked:", data);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>

      <form noValidate onSubmit={handleSubmit(loginSubmit)}>
        <CardContent className="flex flex-col gap-6">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <Button type="submit" className="w-full">
            Login
          </Button>

          <Button type="button" variant="outline" className="w-full">
            Login with Google
          </Button>

          {/* Register link */}
          <div className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
