"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { AuthLayout } from "../AuthLayout";
import { signUpAction } from "@/actions";
import { createSignUpSchema } from "@/schemas";
import regiones from "@/data/regiones.json";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const signUpSchema = createSignUpSchema(regiones);

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpForm>({
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

  const onSubmit = async (values: SignUpForm) => {
    setIsLoading(true);

    try {
      const result = await signUpAction(values);

      if (!result.success) {
        console.log(result.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRegion = regiones.find(
    (region) => region.nombre === form.watch("region"),
  );

  return (
    <AuthLayout>
      <Card className="[--card-spacing:--spacing(8)] ring-0 w-full max-w-xl ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Personal information */}
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            className="border-0"
                          />
                        </FormControl>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            className="border-0"
                          />
                        </FormControl>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    name="run"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUN</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="12.345.678-9"
                            className="border-0"
                          />
                        </FormControl>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="birthdate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of birth</FormLabel>

                        <Popover>
                          <PopoverTrigger
                            render={
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal border-0",
                                  !field.value && "text-muted-foreground",
                                )}
                              />
                            }
                          >
                            <CalendarIcon className="mr-2 size-4" />

                            {field.value ? (
                              format(field.value, "PPP", {
                                locale: es,
                              })
                            ) : (
                              <span>Select date</span>
                            )}
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                </div>
              </FieldGroup>

              {/* Contact */}
              <FieldGroup>
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
                          placeholder="john@gmail.com"
                          className="border-0"
                        />
                      </FormControl>

                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
              </FieldGroup>

              {/* Location */}
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    name="region"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("comuna", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border-0">
                              <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {regiones.map((region) => (
                              <SelectItem
                                key={region.nombre}
                                value={region.nombre}
                              >
                                {region.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="comuna"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="min-w-0">
                        <FormLabel>Municipality</FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedRegion}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full min-w-0 border-0">
                              <SelectValue placeholder="Select a municipality" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {selectedRegion?.comunas.map((comuna) => (
                              <SelectItem key={comuna} value={comuna}>
                                {comuna}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="direccion"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123 Main Street"
                          className="border-0"
                        />
                      </FormControl>

                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
              </FieldGroup>

              {/* Security */}
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>

                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="••••••••"
                            className="border-0"
                          />
                        </FormControl>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>

                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="••••••••"
                            className="border-0"
                          />
                        </FormControl>

                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                </div>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full font-semibold py-5"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-[#8A8A8A] flex justify-center text-sm items-center-safe gap-2 font-medium">
                {"Have an account?"}
                <span>
                  <a
                    className="text-white hover:text-[#007AFF] hover:underline active:underline active:text-[#007AFF]"
                    href="/log-in"
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
