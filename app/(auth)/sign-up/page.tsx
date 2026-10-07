"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpAction } from "@/actions/sign-up";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink } from "@/components/auth";
import { Input, Button } from "@/components/ui";
import { Select } from "@/components/inputs/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { createSignUpSchema } from "@/schemas/auth/sign-up.schema";
import regiones from "@/data/regiones.json";

const inputCls = "bg-[#28282C] hover:bg-[#303036] placeholder:text-white/55";

const signUpSchema = createSignUpSchema(regiones);
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      run: "",
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: undefined,
      region: "",
      comuna: "",
      direccion: "",
    },
  });

  const watchedRegion = form.watch("region");

  const onSubmit = async (data: SignUpFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (value instanceof Date) {
          formData.append(key, value.toISOString().split("T")[0]);
        } else {
          formData.append(key, value);
        }
      }
    });
    await signUpAction(null, formData);
  };

  const RegionField = () => {
    return (
      <FormField
        control={form.control}
        name="region"
        render={({ field }) => (
          <FormItem className="flex flex-col items-stretch gap-1">
            <FormLabel className="text-xs font-medium">Region</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.setValue("comuna", "");
                }}
                required
                className={inputCls}
              >
                <option value="">Select a region</option>
                {regiones.map((r) => (
                  <option key={r.nombre} value={r.nombre}>
                    {r.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const ComunaField = () => {
    const comunas =
      regiones.find((r) => r.nombre === watchedRegion)?.comunas ?? [];

    return (
      <FormField
        control={form.control}
        name="comuna"
        render={({ field }) => (
          <FormItem className="flex flex-col items-stretch gap-1">
            <FormLabel className="text-xs font-medium">Municipality</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onChange={field.onChange}
                required
                disabled={!watchedRegion}
                className={`${inputCls} ${!watchedRegion ? "opacity-50" : ""}`}
              >
                <option value="">
                  {watchedRegion
                    ? "Select a municipality"
                    : "Select a region first"}
                </option>
                {comunas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <AuthLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
              Create account
            </p>
            <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
              Sign up
            </h1>
          </div>

          <FormField
            control={form.control}
            name="run"
            render={({ field }) => (
              <FormItem className="flex flex-col items-stretch gap-1">
                <FormLabel className="text-xs font-medium">RUN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12.345.678-9"
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

          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col items-stretch gap-1">
                  <FormLabel className="text-xs font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col items-stretch gap-1">
                  <FormLabel className="text-xs font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm password"
                      show={showConfirmPassword}
                      onToggle={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      inputClassName={inputCls}
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col items-stretch gap-1">
                  <FormLabel className="text-xs font-medium">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First name"
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
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col items-stretch gap-1">
                  <FormLabel className="text-xs font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      required
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => {
              const value =
                field.value instanceof Date
                  ? field.value.toISOString().split("T")[0]
                  : field.value;
              return (
                <FormItem className="flex flex-col items-stretch gap-1">
                  <FormLabel className="text-xs font-medium">
                    Birthdate (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className={inputCls}
                      value={value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex gap-4">
            <RegionField />
            <ComunaField />
          </div>

          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem className="flex flex-col items-stretch gap-1">
                <FormLabel className="text-xs font-medium">Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address"
                    required
                    maxLength={300}
                    className={inputCls}
                    {...field}
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
            {form.formState.isSubmitting ? "Loading..." : "Sign Up"}
          </Button>

          <AuthSwitchLink
            text="Have an account?"
            href="/log-in"
            linkText="Log in"
          />
        </form>
      </Form>
    </AuthLayout>
  );
}
