"use client";

import { useState } from "react";
import Link from "next/link";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  deleteBlogByIdAction,
  deleteGameAction,
  deleteUserByIdAction,
} from "@/actions/admin";
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

type RowKind = "game" | "user" | "blog" | "studio-game" | "studio-order";

type RowConfig = {
  editBase: string;
  editSuffix?: string;
  editLabel?: string;
  deleteTitle: string;
  runDelete: (id: number) => Promise<{ ok: boolean; error?: string }>;
};

const CONFIG: Record<RowKind, RowConfig> = {
  game: {
    editBase: "/admin/games",
    deleteTitle: "Delete game",
    runDelete: deleteGameAction,
  },
  user: {
    editBase: "/admin/users",
    deleteTitle: "Delete user",
    runDelete: deleteUserByIdAction,
  },
  blog: {
    editBase: "/admin/blogs",
    deleteTitle: "Delete blog",
    runDelete: deleteBlogByIdAction,
  },
  "studio-game": {
    editBase: "/studio/games",
    editSuffix: "/edit",
    deleteTitle: "Delete game",
    runDelete: deleteGameAction,
  },
  "studio-order": {
    editBase: "/studio/orders",
    editLabel: "View",
    deleteTitle: "Delete order",
    runDelete: async () => ({ ok: false, error: "Not supported" }),
  },
};

type Props = Readonly<{
  kind: RowKind;
  id: number;
  label: string;
  allowDelete?: boolean;
}>;

export const RowActions = ({ kind, id, label, allowDelete = true }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const config = CONFIG[kind];

  const handleConfirm = async (): Promise<{ ok: boolean; error?: string }> => {
    const result = await config.runDelete(id);
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
              aria-label={`Open actions for ${label}`}
            />
          }
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href={`${config.editBase}/${id}${config.editSuffix ?? ""}`}
              />
            }
          >
            <PencilIcon />
            {config.editLabel ?? "Edit"}
          </DropdownMenuItem>
          {allowDelete && <DropdownMenuSeparator />}
          {allowDelete && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmOverlay
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={config.deleteTitle}
        description="Are you sure you want to perform this action?"
        confirmLabel="Delete"
        onConfirm={handleConfirm}
      />
    </>
  );
};
