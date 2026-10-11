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
import { useComunas, useRegions } from "@/hooks/use-location";
import { DatePickerField } from "@/components/admin/DatePickerField";
import { Label } from "@/components/ui/label";
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
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: user.email,
      role: user.role,
      password: "",
      nickname: user.profile.nickname,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      birthDate: parseBirthDate(user.profile.birthDate),
      comunaId: user.profile.comunaId ?? null,
      address: user.profile.address,
      bio: user.profile.bio ?? "",
      visibility: user.profile.visibility,
    },
  });

  const [regionId, setRegionId] = useState<number | null>(
    user.profile.regionId ?? null,
  );
  const { regions, loading: regionsLoading } = useRegions();
  const { comunas, loading: comunasLoading } = useComunas(regionId);
  // Mientras carga el catálogo se muestra el texto bonito que ya trae el
  // perfil; después se resuelve por id contra lo fetched.
  const selectedRegion =
    regions.find((region) => region.id === regionId)?.nombre ??
    (regionsLoading ? (user.profile.region ?? null) : null);
  const selectedComuna =
    comunas.find((comuna) => comuna.id === form.watch("comunaId"))?.nombre ??
    (comunasLoading || !regionId ? (user.profile.comuna ?? null) : null);

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
        comunaId: values.comunaId ?? null,
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
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Role</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as UserRole)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full border-0" size="lg">
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
                      inputClassName="border-0"
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
                    <FormLabel required>Nickname</FormLabel>
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
                  value={selectedRegion}
                  onValueChange={(nombre) => {
                    const region = regions.find((r) => r.nombre === nombre);
                    setRegionId(region ? region.id : null);
                    form.setValue("comunaId", null);
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
                      value={selectedComuna}
                      onValueChange={(nombre) => {
                        const comuna = comunas.find((c) => c.nombre === nombre);
                        field.onChange(comuna ? comuna.id : null);
                      }}
                      disabled={!regionId}
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
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={3}
                      className="border-0"
                    />
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
                  <FormLabel required>Visibility</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full" size="lg">
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
