"use client";

import { useActionState, useState } from "react";
import { signUpAction } from "@/actions/sign-up";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink, RegionSelect } from "@/components/auth";
import { Input } from "@/components/ui";
import regiones from "@/data/regiones.json";

const inputCls = "bg-[#28282C] hover:bg-[#303036] placeholder:text-white/55";

const SignUp = () => {
  const [state, formAction, pending] = useActionState(signUpAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout formAction={formAction}>
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
          Create account
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
          Sign up
        </h1>
      </div>
      <div className="min-h-6">
        {state?.errors?.global && (
          <p className="text-red-500 text-sm text-center italic">
            {state.errors.global[0]}
          </p>
        )}
      </div>
      <div>
        <Input
          name="run"
          type="text"
          placeholder="RUT"
          required
          defaultValue={state?.fields?.run}
          className={inputCls}
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
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          defaultValue={state?.fields?.email}
          className={inputCls}
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
            inputClassName={inputCls}
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
            inputClassName={inputCls}
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
          <Input
            name="name"
            type="text"
            placeholder="First name"
            required
            defaultValue={state?.fields?.name}
            className={inputCls}
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
          <Input
            name="lastName"
            type="text"
            placeholder="Last name"
            required
            defaultValue={state?.fields?.lastName}
            className={inputCls}
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
        <Input
          id="birthdate"
          name="birthdate"
          type="date"
          defaultValue={state?.fields?.birthdate}
          className={inputCls}
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
        selectClassName={inputCls}
      />
      <div>
        <Input
          name="direccion"
          type="text"
          placeholder="Address"
          required
          maxLength={300}
          defaultValue={state?.fields?.direccion}
          className={inputCls}
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
        className="flex items-center gap-1 justify-center bg-[#007aff] hover:bg-[#26bbff] text-white rounded-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 ease-in-out focus-visible:ring-[#26BBFF]"
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
