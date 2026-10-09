"use client";

import { useState } from "react";
import { deleteBlogByIdAction } from "@/actions/admin";
import { ConfirmOverlay } from "@/components/feedback/ConfirmOverlay";

type Props = Readonly<{ id: number; title: string }>;

export const DeleteBlogButton = ({ id, title }: Props) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async (): Promise<{ ok: boolean; error?: string }> => {
    const result = await deleteBlogByIdAction(id);
    if (result.ok) {
      setOpen(false);
    }
    return { ok: result.ok, error: result.error };
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[#FF6B6B] hover:text-red-400 text-sm font-medium cursor-pointer"
        aria-label={`Delete blog ${title}`}
      >
        Delete
      </button>
      <ConfirmOverlay
        open={open}
        onClose={() => setOpen(false)}
        title="Delete blog"
        description="Are you sure you want to perform this action?"
        confirmLabel="Delete"
        onConfirm={handleConfirm}
      />
    </>
  );
};
