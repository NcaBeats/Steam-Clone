"use client";

import { useActionState, useState } from "react";
import { signUpAction } from "@/actions/sign-up";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink, RegionSelect } from "@/components/auth";
import regiones from "@/data/regiones.json";

const SignUp = () => {
  const [state, formAction, pending] = useActionState(signUpAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout formAction={formAction}>
      <h1 className="text-3xl text-[#8D8C8D] font-bold text-center mt-20">
        Create an account
      </h1>
      <div className="min-h-6">
        {state?.errors?.global && (
          <p className="text-red-500 text-sm text-center italic">
            {state.errors.global[0]}
          </p>
        )}
      </div>
      <div>
        <input
          name="run"
          type="text"
          placeholder="RUT"
          required
          defaultValue={state?.fields?.run}
          className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
        />
        <div className="min-h-5">
          {state?.errors?.run && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.run[0]}
            </p>
          )}
        </div>
      </div>
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          defaultValue={state?.fields?.email}
          className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
        />
        <div className="min-h-5">
          {state?.errors?.email && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.email[0]}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <PasswordInput
            name="password"
            placeholder="Password"
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            defaultValue={state?.fields?.password}
          />
          <div className="min-h-5">
            {state?.errors?.password && (
              <p className="text-red-500 text-xs mt-1 italic">
                {state.errors.password[0]}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm password"
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <div className="min-h-5">
            {state?.errors?.password && (
              <p className="text-red-500 text-xs mt-1 italic">
                {state.errors.password[0]}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            name="name"
            type="text"
            placeholder="First name"
            required
            defaultValue={state?.fields?.name}
            className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
          />
          <div className="min-h-5">
            {state?.errors?.name && (
              <p className="text-red-500 text-xs mt-1 italic">
                {state.errors.name[0]}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <input
            name="lastName"
            type="text"
            placeholder="Last name"
            required
            defaultValue={state?.fields?.lastName}
            className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
          />
          <div className="min-h-5">
            {state?.errors?.lastName && (
              <p className="text-red-500 text-xs mt-1 italic">
                {state.errors.lastName[0]}
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="birthdate" className="text-[#8A8A8A] text-xs">
          Optional
        </label>
        <input
          id="birthdate"
          name="birthdate"
          type="date"
          defaultValue={state?.fields?.birthdate}
          className="bg-[#1A1A1A] rounded-lg pl-3 pr-5 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
        />
        <div className="min-h-5">
          {state?.errors?.birthdate && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.birthdate[0]}
            </p>
          )}
        </div>
      </div>
      <RegionSelect
        regiones={regiones}
        layout="inline"
        regionError={state?.errors?.region}
        comunaError={state?.errors?.comuna}
      />
      <div>
        <input
          name="direccion"
          type="text"
          placeholder="Address"
          required
          maxLength={300}
          defaultValue={state?.fields?.direccion}
          className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
        />
        <div className="min-h-5">
          {state?.errors?.direccion && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.direccion[0]}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-1 justify-center bg-[#007AFF] hover:bg-[#1ea4ff] text-[#FAFAFA] rounded-md py-2 font-semibold disabled:opacity-50 cursor-pointer transition-colors duration-200 ease-in-out"
      >
        {pending ? "Loading..." : "Sign Up"}
      </button>
      <AuthSwitchLink
        text="Have an account?"
        href="/log-in"
        linkText="Log in"
      />
    </AuthLayout>
  );
};

export default SignUp;
