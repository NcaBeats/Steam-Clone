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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [run, setRun] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [comuna, setComuna] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 4 || password.length > 10) {
      setError("La contraseña debe tener entre 4 y 10 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!validateRun(run)) {
      setError("El RUN no es válido (7-9 caracteres, sin puntos ni guiones)");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("run", cleanRun(run));
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    if (birthDate) formData.set("birthDate", birthDate);
    formData.set("region", region || "");
    formData.set("comuna", comuna || "");
    formData.set("address", address);

    startTransition(async () => {
      const result = await createUserFromFormAction(formData);
      if (!result.ok) {
        setError(result.error ?? "No se pudo crear el usuario");
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
          Cuenta
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className={labelCls}>
              Contraseña
            </label>
            <PasswordInput
              name="password"
              required
              minLength={4}
              maxLength={10}
              placeholder="4-10 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="confirmPassword" className={labelCls}>
              Confirmar contraseña
            </label>
            <PasswordInput
              name="confirmPassword"
              required
              minLength={4}
              maxLength={10}
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <legend className="text-sm font-semibold text-[#FAFAFA] mb-2">
          Perfil
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
              maxLength={9}
              placeholder="19011022K"
              value={run}
              onChange={(e) => setRun(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className={labelCls}>
              Nombres
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
              Apellidos
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
              Fecha de nacimiento
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
              Región
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
              Comuna
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
              Dirección
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
      </fieldset>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {pending ? "Creando..." : "Crear usuario"}
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
