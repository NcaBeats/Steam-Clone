"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/actions/login";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { PasswordInput, AuthSwitchLink } from "@/components/auth";
import { Input } from "@/components/ui";

const inputCls = "bg-[#28282C] hover:bg-[#303036] placeholder:text-white/55";

const LogIn = () => {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout formAction={formAction}>
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
          Sign in
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
          Hi, Welcome
        </h1>
      </div>
      <div className="min-h-[24px]">
        {state?.errors?.global && (
          <p className="text-red-500 text-sm text-center italic">
            {state.errors.global[0]}
          </p>
        )}
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <div className="min-h-[20px]">
          {state?.errors?.email && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.email[0]}
            </p>
          )}
        </div>
      </div>
      <div>
        <PasswordInput
          name="password"
          placeholder="Password"
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClassName={inputCls}
        />
        <div className="min-h-[20px]">
          {state?.errors?.password && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.password[0]}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-1 justify-center bg-[#007aff] hover:bg-[#26bbff] text-white rounded-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200 ease-in-out focus-visible:ring-[#26BBFF]"
      >
        {pending ? "Loading..." : "Log In"}
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
