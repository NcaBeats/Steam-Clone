"use client";

import { useState } from "react";
import { AuthLayout } from "../AuthLayout";
import { loginAction } from "@/actions";
import { PasswordInput } from "@/components/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormItem,
  FormMessage,
  FormControl,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const result = await loginAction(values);

    if (!result.success) {
      console.log(result.errors);
    }
  };

  return (
    <AuthLayout>
      <Card className="[--card-spacing:--spacing(8)] w-full max-w-sm ring-0">
        <CardHeader>
          <CardTitle className="text-2xl text-left font-bold">
            Sign In to continue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="user@gmail.com"
                        className="border-0"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="••••••••"
                        inputClassName="border-0"
                        required={false}
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={
                  "bg-[#007AFF] hover:bg-[#1ea4ff] font-semibold text-white py-5"
                }
                size={"lg"}
              >
                Log In
              </Button>

              <p className="text-[#8A8A8A] flex justify-center text-sm items-center-safe gap-2 font-medium">
                {"Don't have an account?"}
                <span>
                  <a
                    className="text-white hover:text-[#1ea4ff] hover:underline active:underline active:text-[#1ea4ff]"
                    href="/sign-up"
                  >
                    Sign up
                  </a>
                </span>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
