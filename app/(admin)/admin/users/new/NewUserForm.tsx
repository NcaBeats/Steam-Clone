"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldGroup } from "@/components/ui/field";
import { PasswordInput } from "@/components/auth";
import { createUserFromFormAction } from "@/actions/admin";
import { AdminUserCreateSchema } from "@/schemas/admin/user.schema";
import { DatePickerField } from "@/components/admin/DatePickerField";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  REGION_OPTIONS,
  getComunasByRegion,
  type Region,
} from "@/components/admin/LocationSelects";

const NewUserFormSchema = AdminUserCreateSchema.extend({
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(300, "Address cannot exceed 300 characters"),
  birthDate: z.date().nullable().optional(),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type NewUserFormValues = z.infer<typeof NewUserFormSchema>;

export function NewUserForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(NewUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      run: "",
      firstName: "",
      lastName: "",
      birthDate: null,
      region: "",
      comuna: "",
      address: "",
    },
  });

  const regionValue = form.watch("region") as Region | "";
  const comunas = getComunasByRegion(regionValue);

  const onSubmit = (values: NewUserFormValues) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("confirmPassword", values.confirmPassword);
    formData.set("run", values.run);
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set(
      "birthDate",
      values.birthDate ? format(values.birthDate, "yyyy-MM-dd") : "",
    );
    formData.set("region", values.region ?? "");
    formData.set("comuna", values.comuna ?? "");
    formData.set("address", values.address);

    setServerError(null);
    startTransition(async () => {
      const result = await createUserFromFormAction(formData);
      if (!result.ok) {
        setServerError(result.error ?? "Could not create the user");
        return;
      }
      router.push("/admin/users");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-md border border-[#5C2A2A] bg-[#2A1A1A] p-3 text-sm text-[#FF6B6B]"
          >
            {serverError}
          </div>
        )}

        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-semibold text-foreground mb-2">
            Account
          </legend>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        maxLength={100}
                        placeholder="user@gmail.com"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="4-10 characters"
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="Repeat password"
                        show={showConfirmPassword}
                        onToggle={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            </div>
          </FieldGroup>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border-t border-border pt-4">
          <legend className="text-sm font-semibold text-foreground mb-2">
            Profile
          </legend>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="run"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={13}
                        placeholder="12.345.678-9"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" maxLength={50} />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" maxLength={100} />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <DatePickerField
                        label="Date of birth"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => {
                  const selectedLabel =
                    REGION_OPTIONS.find((option) => option.key === field.value)
                      ?.label ?? null;
                  return (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Combobox
                        items={REGION_OPTIONS.map((option) => option.label)}
                        value={selectedLabel}
                        onValueChange={(label) => {
                          const option = REGION_OPTIONS.find(
                            (o) => o.label === label,
                          );
                          field.onChange(option ? option.key : "");
                          form.setValue("comuna", "");
                        }}
                      >
                        <FormControl>
                          <ComboboxInput
                            placeholder="Select a region"
                            className="w-full border-0 h-10"
                          />
                        </FormControl>
                        <ComboboxContent>
                          <ComboboxEmpty>No region found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: string) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FormMessage className="text-left" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="comuna"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Municipality</FormLabel>
                    <Combobox
                      items={comunas}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!regionValue}
                    >
                      <FormControl>
                        <ComboboxInput
                          placeholder="Select a municipality"
                          className="w-full min-w-0 border-0 h-10"
                        />
                      </FormControl>
                      <ComboboxContent>
                        <ComboboxEmpty>No municipality found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" maxLength={300} />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            </div>
          </FieldGroup>
        </fieldset>

        <div className="flex items-center gap-2 mt-2">
          <Button
            type="submit"
            disabled={pending}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            {pending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create user"
            )}
          </Button>
          <Link
            href="/admin/users"
            className="text-muted-foreground hover:text-foreground text-sm px-4 py-2.5"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  );
}
