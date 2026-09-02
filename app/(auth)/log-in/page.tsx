"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/actions/login";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink } from "@/components/auth";

const LogIn = () => {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout formAction={formAction}>
      <h1 className="text-3xl text-[#8D8C8D] font-bold text-center">
        Hi, Welcome
      </h1>
      {state?.errors?.global && (
        <p className="text-red-500 text-sm text-center italic">
          {state.errors.global[0]}
        </p>
      )}
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          defaultValue={state?.fields?.email}
          className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-xs mt-1 italic">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div>
        <PasswordInput
          name="password"
          placeholder="Password"
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          defaultValue={state?.fields?.password}
        />
        {state?.errors?.password && (
          <p className="text-red-500 text-xs mt-1 italic">
            {state.errors.password[0]}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className={`flex items-center gap-1 justify-center bg-[#007AFF] hover:bg-[#1ea4ff] text-[#FAFAFA] rounded-md py-2 font-semibold disabled:opacity-50 ${pending ? "cursor-deafult" : "cursor-pointer"} transition-colors duration-200 ease-in-out`}
      >
        {pending ? "Cargando..." : "Log In"}
      </button>
      <AuthSwitchLink
        text="Don't have an account?"
        href="/sign-up"
        linkText="Sign up"
      />
    </AuthLayout>
  );
};

export default LogIn;
