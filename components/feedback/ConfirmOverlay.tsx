"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Trash2 } from "lucide-react";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<{ ok: boolean; error?: string }>;
}>;

export const ConfirmOverlay = ({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
}: Props) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!open) {
      setPending(false);
      setError(null);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    setPending(true);
    setError(null);
    const result = await onConfirm().catch(() => ({
      ok: false,
      error: undefined,
    }));
    setPending(false);
    if (!result.ok) {
      setError(
        result.error ?? "The action could not be completed. Please try again.",
      );
    }
  };

  const overlay = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={pending ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-overlay-title"
    >
      <div
        className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-2xs p-6 flex flex-col gap-4 shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          aria-label="Close"
          className="absolute top-3 right-3 text-[#8A8A8A] hover:text-white hover:bg-[#2A2A2A] active:bg-[#2A2A2A] rounded-md p-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-1 items-center text-center">
          <h2
            id="confirm-overlay-title"
            className="text-xl font-bold text-[#FAFAFA]"
          >
            {title}
          </h2>
          <p className="text-sm break-words text-[#8A8A8A]">{description}</p>
        </div>

        {error && <p className="text-sm text-[#FF6B6B]">{error}</p>}

        <div className="flex flex-col gap-3 mt-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="flex items-center justify-center gap-2 bg-[#EDEDED] text-[#0A0A0A] border hover:bg-[#b0b0b0] px-3 py-3 font-semibold text-sm text-center rounded-md cursor-pointer transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            {pending ? "Deleting..." : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="flex items-center justify-center gap-2 bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E] hover:bg-[#2E2E2E] px-3 py-3 font-semibold text-sm text-center rounded-md cursor-pointer transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};
