"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/actions/login";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink } from "@/components/auth";

const SignUp = () => {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout formAction={formAction}>
      <h1 className="text-3xl text-[#8D8C8D] font-bold text-center">
        Create an account
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
      <PasswordInput
        name="confirmPassword"
        placeholder="Confirm Password"
        show={showConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-1 justify-center bg-[#007AFF] hover:bg-[#1ea4ff] text-[#FAFAFA] rounded-md py-2 font-semibold disabled:opacity-50 cursor-pointer transition-colors duration-200 ease-in-out"
      >
        {pending ? "Cargando..." : "Sign Up"}
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
