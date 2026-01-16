"use client";

import { useForm } from "react-hook-form";

import { Button } from "./ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginType = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.email("Please input email").nonempty(),
  password: z.string().min(8, "At lest 8 characters").nonempty(),
});

export default function LoginForm() {
  // 1. Define form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function loginSubmit(data: any) {
    console.log("login clicked: ", data);
  }

  console.log(watch("email"));

  return (
    <Card className="w-full max-w-sm">

      <CardHeader>

        <CardTitle>Login to your account</CardTitle>

      </CardHeader>

      <CardContent>

        <form onSubmit={handleSubmit(loginSubmit)}>

          <div className="flex flex-col gap-6">
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" {...register("password")} />
              <p className="text-red-500">{errors.password?.message}</p>
            </div>
            {/* buttons */}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
