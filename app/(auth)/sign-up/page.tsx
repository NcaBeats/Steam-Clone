"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { EyeOff, Eye, LogIn as LogInIcon, CornerUpLeft } from "lucide-react";
import Link from "next/link";

const SignUp = () => {

  const [state, formAction, pending] = useActionState(loginAction, null);
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);

  return <div className="flex justify-center items-center min-h-screen">
    <Link className="absolute left-6 top-8 hover:bg-[#3a3a3a] p-2 rounded-lg transition-colors duration-200 ease-out" href={"/"}>
      <CornerUpLeft />
    </Link>

    <form
      action={formAction}
      className="flex flex-col gap-4 w-100 p-6 rounded-lg"
    >
      <h1 className="text-3xl  text-[#8D8C8D] font-bold text-center">
        Create an account
      </h1>

      <div className="flex flex-col gap-4">
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="bg-[#1A1A1A] rounded-lg px-3 py-3 text-[#FAFAFA] font-medium text-sm "
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
            className="bg-[#1A1A1A] rounded-lg px-3 py-3 w-full "
          />
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="absolute right-2 text-[#8D8C8D] hover:bg-[#3a3a3a] p-1 transition-colors duration-100 ease-in rounded-lg"
          >
            {isActive ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </label>

        <label
          htmlFor="password"
          className="flex relative items-center font-medium text-sm"
        >
          <input
            name="confirmPassword"
            type={isActive2 ? "text" : "password"}
            placeholder="Confirm Password"
            required
            className="bg-[#1A1A1A] rounded-lg px-3 py-3 w-full "
          />
          <button
            type="button"
            onClick={() => setIsActive2(!isActive2)}
            className="absolute right-2 text-[#8D8C8D] hover:bg-[#3a3a3a] p-1 transition-colors duration-100 ease-in rounded-lg"
          >
            {isActive2 ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1 justify-center bg-[#007AFF] hover:bg-[#1ea4ff] text-[#FAFAFA] rounded-md py-2 font-semibold disabled:opacity-50 cursor-pointer transition-colors duration-200 ease-in-out"
        >
          {pending ? "Cargando..." : "Sign Up"}
        </button>

        <p className="text-[#8A8A8A] flex justify-center text-sm items-center-safe gap-2 font-medium">
          Have an account?
          <span>
            <Link className="text-white  hover:text-[#007AFF] hover:underline active:underline :active:text-[#007AFF]" href={"/log-in"}>Log in</Link>
          </span>
        </p>
        
      </div>

    </form>
  </div>;
};

export default SignUp;
