"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { EyeOff, Eye, LogIn as LogInIcon } from "lucide-react";
import Image from "next/image";

const LogIn = () => {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        action={formAction}
        className="flex flex-col gap-4 w-100  p-6 rounded-lg"
      >
        <Image
          src={"Logo.svg"}
          width={128}
          height={128}
          alt="Steam Logo"
          className="w-auto h-15 mb-8"
        />
        <h1 className="text-sm text-[#EDEDED] font-medium text-center">
          Please sign in to continue
        </h1>
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm"
        />
        <label
          htmlFor="password"
          className="flex relative items-center font-medium text-sm"
        >
          <input
            name="password"
            type={isActive ? "text" : "password"}
            placeholder="Password"
            required
            className="bg-[#1A1A1A] rounded-lg px-3 py-3 w-full"
          />
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="absolute right-2 text-[#8D8C8D] hover:bg-[#3a3a3a] p-1 transition-colors duration-100 ease-in rounded-lg"
          >
            {isActive ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1 justify-center bg-[#007AFF] hover:bg-[#1ea4ff] text-[#FAFAFA] rounded-md py-2 font-bold disabled:opacity-50 cursor-pointer transition-colors duration-200 ease-in-out"
        >
          {pending ? "Cargando..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LogIn;
