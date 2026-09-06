"use client";

import { useActionState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Input, Textarea } from "@/components/ui";
import { sendContactAction, type ContactFormState } from "@/actions/contact";

const initialState: ContactFormState = {
  success: false,
  errors: null,
};

export const ContactForm = () => {
  const [state, formAction, pending] = useActionState(
    sendContactAction,
    initialState,
  );

  if (state.success) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-8 flex flex-col items-center text-center gap-3">
        <CheckCircle2 size={56} className="text-[#A1CD44]" />
        <h2 className="text-xl font-bold text-[#FAFAFA]">Message sent</h2>
        <p className="text-sm text-[#8A8A8A]">
          Thank you for reaching out. We will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-[#8A8A8A] font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={state?.fields?.name}
        />
        <div className="min-h-5">
          {state?.errors?.name && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.name[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs text-[#8A8A8A] font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={state?.fields?.email}
        />
        <div className="min-h-5">
          {state?.errors?.email && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.email[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="comment" className="text-xs text-[#8A8A8A] font-medium">
          Message
        </label>
        <Textarea
          id="comment"
          name="comment"
          required
          rows={5}
          defaultValue={state?.fields?.comment}
          className="min-h-32"
        />
        <div className="min-h-5">
          {state?.errors?.comment && (
            <p className="text-red-500 text-xs mt-1 italic">
              {state.errors.comment[0]}
            </p>
          )}
        </div>
      </div>

      {state?.errors?.global && (
        <div className="bg-[#2A1A1A] border border-[#5C2A2A] rounded-md p-3 text-sm text-[#FF6B6B]">
          {state.errors.global[0]}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-[#007AFF] hover:bg-[#1ea4ff] text-white font-semibold py-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send message
          </>
        )}
      </button>
    </form>
  );
};
