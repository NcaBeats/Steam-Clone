"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { clean as cleanRun, validate as validateRun } from "rut.js";
import { Input } from "@/components/ui";
import { PasswordInput } from "@/components/auth";
import { createUserFromFormAction } from "@/actions/admin";
import {
  ComunaSelect,
  RegionSelect,
  type Region,
} from "@/components/admin/LocationSelects";

export function NewUserForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [region, setRegion] = useState<Region | "">("");
  const [comuna, setComuna] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
    const run = formData.get("run")?.toString() ?? "";
    const cleanedRun = cleanRun(run);

    if (password.length < 4 || password.length > 10) {
      setError("Password must be between 4 and 10 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validateRun(cleanedRun)) {
      setError("RUN is not valid (e.g. 12.345.678-9)");
      return;
    }

    formData.set("run", cleanedRun);
    formData.set("region", region || "");
    formData.set("comuna", comuna || "");

    setError(null);
    startTransition(async () => {
      const result = await createUserFromFormAction(formData);
      if (!result.ok) {
        setError(result.error ?? "Could not create the user");
        return;
      }
      router.push("/admin/users");
      router.refresh();
    });
  };

  const labelCls = "text-xs text-[#8A8A8A] font-medium";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-4"
    >
      {error && <p className="text-red-500 text-sm italic">{error}</p>}

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
              maxLength={100}
              placeholder="user@gmail.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className={labelCls}>
              Password
            </label>
            <PasswordInput
              name="password"
              required
              minLength={4}
              maxLength={10}
              placeholder="4-10 characters"
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="confirmPassword" className={labelCls}>
              Confirm password
            </label>
            <PasswordInput
              name="confirmPassword"
              required
              minLength={4}
              maxLength={10}
              placeholder="Repeat password"
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <legend className="text-sm font-semibold text-[#FAFAFA] mb-2">
          Profile
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="run" className={labelCls}>
              RUN
            </label>
            <Input
              id="run"
              name="run"
              type="text"
              required
              maxLength={13}
              placeholder="12.345.678-9"
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
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="birthDate" className={labelCls}>
              Date of birth
            </label>
            <Input id="birthDate" name="birthDate" type="date" />
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
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {pending ? "Creating..." : "Create user"}
        </button>
        <Link
          href="/admin/users"
          className="text-[#8A8A8A] hover:text-white text-sm px-4 py-2.5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
