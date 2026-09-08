"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert, Input, Select, Textarea } from "@/components/ui";
import { PasswordInput } from "@/components/auth";
import {
  ComunaSelect,
  RegionSelect,
  type Region,
} from "@/components/admin/LocationSelects";
import { updateUserAction, updateUserProfileAction } from "@/actions/admin";
import type { AdminUser, UserRole } from "@/types";

type Props = Readonly<{
  user: AdminUser;
}>;

export function UserEditForm({ user }: Props) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState(user.profile.nickname);
  const [bio, setBio] = useState(user.profile.bio ?? "");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(
    user.profile.visibility,
  );
  const [firstName, setFirstName] = useState(user.profile.firstName);
  const [lastName, setLastName] = useState(user.profile.lastName);
  const [birthDate, setBirthDate] = useState(user.profile.birthDate ?? "");
  const [region, setRegion] = useState<Region | "">(
    (user.profile.region as Region | null) ?? "",
  );
  const [comuna, setComuna] = useState(user.profile.comuna ?? "");
  const [address, setAddress] = useState(user.profile.address);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userResult = await updateUserAction(user.id, {
        email,
        role,
        password: password.trim() || undefined,
      });
      if (!userResult.ok) {
        showAlert({
          variant: "destructive",
          title: "Save error",
          description: userResult.error ?? "Could not update the user",
        });
        setSaving(false);
        return;
      }

      const profileResult = await updateUserProfileAction(user.id, {
        nickname,
        bio: bio || null,
        visibility,
        firstName,
        lastName,
        birthDate: birthDate || null,
        region: region || null,
        comuna: comuna || null,
        address,
      });

      if (!profileResult.ok) {
        showAlert({
          variant: "destructive",
          title: "Profile save error",
          description: profileResult.error ?? "Could not update the profile",
        });
        setSaving(false);
        return;
      }

      showAlert({
        variant: "default",
        title: "User updated",
        description: `${email} updated successfully`,
      });
      router.push("/admin/users");
      router.refresh();
    } catch (e) {
      showAlert({
        variant: "destructive",
        title: "Error",
        description: e instanceof Error ? e.message : "Unknown error",
      });
      setSaving(false);
    }
  };

  const labelCls = "text-xs text-[#8A8A8A] font-medium";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-4"
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-[#FAFAFA] mb-2">
          Account
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className={labelCls}>
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className={labelCls}>
              Role
            </label>
            <Select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="VENDEDOR">VENDEDOR</option>
              <option value="CLIENTE">CLIENTE</option>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className={labelCls}>
            New password (optional, leave blank to keep current)
          </label>
          <PasswordInput
            name="password"
            required={false}
            minLength={4}
            maxLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <legend className="text-sm font-semibold text-[#FAFAFA] mb-2">
          Profile
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="nickname" className={labelCls}>
              Nickname
            </label>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              required
              maxLength={50}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className={labelCls}>
              First name
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              maxLength={50}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lastName" className={labelCls}>
              Last name
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              maxLength={100}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="birthDate" className={labelCls}>
              Date of birth
            </label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="region" className={labelCls}>
              Region
            </label>
            <RegionSelect
              name="region"
              value={region}
              onValueChange={(v) => {
                setRegion(v as Region);
                if (comuna) setComuna("");
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="comuna" className={labelCls}>
              Municipality
            </label>
            <ComunaSelect
              name="comuna"
              value={comuna}
              region={region}
              onValueChange={setComuna}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="address" className={labelCls}>
              Address
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              maxLength={300}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className={labelCls}>
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="visibility" className={labelCls}>
            Visibility
          </label>
          <Select
            id="visibility"
            name="visibility"
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "PUBLIC" | "PRIVATE")
            }
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </Select>
        </div>
      </fieldset>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
