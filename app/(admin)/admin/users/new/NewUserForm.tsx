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
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useComunas, useRegions } from "@/hooks/use-location";

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
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      run: "",
      firstName: "",
      lastName: "",
      birthDate: null,
      comunaId: undefined,
      address: "",
    },
  });

  const [regionId, setRegionId] = useState<number | null>(null);
  const { regions, loading: regionsLoading } = useRegions();
  const { comunas } = useComunas(regionId);
  const selectedRegion = regions.find((region) => region.id === regionId);
  const selectedComuna = comunas.find(
    (comuna) => comuna.id === form.watch("comunaId"),
  );

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
    formData.set("comunaId", values.comunaId ? String(values.comunaId) : "");
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
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        maxLength={100}
                        placeholder="user@gmail.com"
                        className="border-0"
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
                    <FormLabel required>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="4-10 characters"
                        inputClassName="border-0"
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
                    <FormLabel required>Confirm password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="Repeat password"
                        inputClassName="border-0"
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
                    <FormLabel required>RUN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={13}
                        placeholder="12.345.678-9"
                        className="border-0"
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
                    <FormLabel required>First name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={50}
                        className="border-0"
                      />
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
                    <FormLabel required>Last name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={100}
                        className="border-0"
                      />
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
              <FormItem>
                <Label>Region</Label>
                <Combobox
                  items={regions.map((region) => region.nombre)}
                  value={selectedRegion?.nombre ?? null}
                  onValueChange={(nombre) => {
                    const region = regions.find((r) => r.nombre === nombre);
                    setRegionId(region ? region.id : null);
                    form.setValue("comunaId", undefined);
                  }}
                  disabled={regionsLoading}
                >
                  <ComboboxInput
                    placeholder="Select a region"
                    className="w-full border-0 h-10"
                  />
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
                <p className="min-h-5 text-sm" aria-hidden="true">
                  {"\u00A0"}
                </p>
              </FormItem>
              <FormField
                control={form.control}
                name="comunaId"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Municipality</FormLabel>
                    <Combobox
                      items={comunas.map((comuna) => comuna.nombre)}
                      value={selectedComuna?.nombre ?? null}
                      onValueChange={(nombre) => {
                        const comuna = comunas.find((c) => c.nombre === nombre);
                        field.onChange(comuna ? comuna.id : undefined);
                      }}
                      disabled={!selectedRegion}
                    >
                      <FormControl>
                        <ComboboxInput
                          placeholder="Select a municipality"
                          className="w-full min-w-0 border-0 h-10 py-1"
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
                    <FormLabel required>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        maxLength={300}
                        className="border-0"
                      />
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
