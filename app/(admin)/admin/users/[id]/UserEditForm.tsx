"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAlert } from "@/components/feedback";
import { Input, Textarea } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DatePickerField } from "@/components/admin/DatePickerField";
import { updateUserAction, updateUserProfileAction } from "@/actions/admin";
import {
  AdminUserEditSchema,
  type AdminUserEditInput,
} from "@/schemas/admin/user-edit.schema";
import type { AdminUser, UserRole } from "@/types";

type Props = Readonly<{
  user: AdminUser;
}>;

const parseBirthDate = (raw: string | null): Date | null => {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function UserEditForm({ user }: Props) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminUserEditInput>({
    resolver: zodResolver(AdminUserEditSchema),
    defaultValues: {
      email: user.email,
      role: user.role,
      password: "",
      nickname: user.profile.nickname,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      birthDate: parseBirthDate(user.profile.birthDate),
      region: user.profile.region ?? "",
      comuna: user.profile.comuna ?? "",
      address: user.profile.address,
      bio: user.profile.bio ?? "",
      visibility: user.profile.visibility,
    },
  });

  const regionValue = form.watch("region") as Region | "";
  const comunas = getComunasByRegion(regionValue);

  const onSubmit = async (values: AdminUserEditInput) => {
    try {
      const userResult = await updateUserAction(user.id, {
        email: values.email,
        role: values.role,
        password: values.password || undefined,
      });
      if (!userResult.ok) {
        showAlert({
          variant: "destructive",
          title: "Save error",
          description: userResult.error ?? "Could not update the user",
        });
        return;
      }

      const profileResult = await updateUserProfileAction(user.id, {
        nickname: values.nickname,
        bio: values.bio || null,
        visibility: values.visibility,
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate
          ? format(values.birthDate, "yyyy-MM-dd")
          : (user.profile.birthDate ?? null),
        region: values.region || null,
        comuna: values.comuna || null,
        address: values.address,
      });

      if (!profileResult.ok) {
        showAlert({
          variant: "destructive",
          title: "Profile save error",
          description: profileResult.error ?? "Could not update the profile",
        });
        return;
      }

      showAlert({
        variant: "default",
        title: "User updated",
        description: `${values.email} updated successfully`,
      });
      router.push("/admin/users");
      router.refresh();
    } catch (e) {
      showAlert({
        variant: "destructive",
        title: "Error",
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
      >
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
                      <Input {...field} type="email" maxLength={100} />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as UserRole)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="VENDEDOR">VENDEDOR</SelectItem>
                        <SelectItem value="CLIENTE">CLIENTE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    New password (optional, leave blank to keep current)
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      placeholder="••••••"
                      show={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
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
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" maxLength={50} />
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
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} rows={3} />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
          </FieldGroup>
        </fieldset>

        <div className="flex items-center gap-2 mt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
