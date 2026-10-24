"use client";

import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  pending = false,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-11 items-center justify-center rounded-xl bg-error-container text-error">
            <MaterialIcon name="delete_forever" size={24} />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="bg-error text-on-error hover:bg-error/90"
          >
            <MaterialIcon name="delete_outline" size={16} />
            {pending ? "Menghapus..." : "Hapus permanen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
