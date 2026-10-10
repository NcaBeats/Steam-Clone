"use client";

import { useState } from "react";
import Link from "next/link";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { deleteGameAction } from "@/actions/admin";
import { ConfirmOverlay } from "@/components/feedback/ConfirmOverlay";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = Readonly<{ id: number; name: string }>;

export const GameRowActions = ({ id, name }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = async (): Promise<{ ok: boolean; error?: string }> => {
    const result = await deleteGameAction(id);
    if (result.ok) {
      setConfirmOpen(false);
    }
    return { ok: result.ok, error: result.error };
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Open actions for ${name}`}
            />
          }
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem render={<Link href={`/admin/games/${id}`} />}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmOverlay
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete game"
        description="Are you sure you want to perform this action?"
        confirmLabel="Delete"
        onConfirm={handleConfirm}
      />
    </>
  );
};
