"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/actions/login";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink } from "@/components/auth";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas/auth/login.schema";

const inputCls = "bg-[#28282C] hover:bg-[#303036] placeholder:text-white/55";

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LogInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    await loginAction(null, formData);
  };

  return (
    <AuthLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
              Sign in
            </p>
            <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
              Hi, Welcome
            </h1>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-stretch gap-1">
                <FormLabel className="text-xs font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col items-stretch gap-1">
                <FormLabel className="text-xs font-medium">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    name="password"
                    placeholder="Password"
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    inputClassName={inputCls}
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-[#007aff] hover:bg-[#26bbff] text-[#FAFAFA] font-semibold py-2.5 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-[#26BBFF]"
          >
            {form.formState.isSubmitting ? "Loading..." : "Log In"}
          </Button>

          <AuthSwitchLink
            text="Don't have an account?"
            href="/sign-up"
            linkText="Sign up"
          />
        </form>
      </Form>
    </AuthLayout>
  );
}
