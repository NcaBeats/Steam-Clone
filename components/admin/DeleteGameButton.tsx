"use client";

import { useState } from "react";
import { deleteGameAction } from "@/actions/admin";
import { ConfirmOverlay } from "@/components/ui/ConfirmOverlay";

type Props = Readonly<{ id: number; name: string }>;

export const DeleteGameButton = ({ id, name }: Props) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async (): Promise<{ ok: boolean; error?: string }> => {
    const result = await deleteGameAction(id);
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
        aria-label={`Delete game ${name}`}
      >
        Delete
      </button>
      <ConfirmOverlay
        open={open}
        onClose={() => setOpen(false)}
        title="Delete game"
        description="Are you sure you want to perform this action?"
        confirmLabel="Delete"
        onConfirm={handleConfirm}
      />
    </>
  );
};
