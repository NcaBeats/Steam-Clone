"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export const AuthOverlay = ({ open, onClose }: Props) => {
  // AlertDialog no cierra con click fuera por diseño: se habilita acá.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (
        (e.target as HTMLElement).closest('[data-slot="alert-dialog-overlay"]')
      ) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, onClose]);

  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent size="sm" className="gap-3">
        <AlertDialogHeader>
          <AlertDialogTitle>Sign in to continue</AlertDialogTitle>
          <AlertDialogDescription>
            You need an account to complete your purchase.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="p-3">
          <AlertDialogCancel
            nativeButton={false}
            className={buttonVariants({ variant: "outline" })}
            render={<Link href="/log-in" onClick={onClose} />}
          >
            Log in
          </AlertDialogCancel>
          <AlertDialogAction
            nativeButton={false}
            render={<Link href="/sign-up" onClick={onClose} />}
          >
            Sign up
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
