"use client";

import { useState } from "react";
import { Loader2, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteOrder } from "@/hooks";
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

export function DeleteOrderButton({ orderId, canDelete }: { orderId: string; canDelete: boolean }) {
  const deleteOrder = useDeleteOrder();
  const [open, setOpen] = useState(false);
  const isDeleting = deleteOrder.isPending;

  function handleDelete() {
    deleteOrder.mutate(orderId, { onSettled: () => setOpen(false) });
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-xs" asChild>
              <Link href={`/orders/${orderId}`}>
                <Pencil size={13} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View order details</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setOpen(true)}
              disabled={!canDelete || isDeleting}
              className="text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={13} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {canDelete ? "Delete this order" : "Orders with payments cannot be deleted"}
          </TooltipContent>
        </Tooltip>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The order and all its line items will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="animate-spin" size={14} />}
              {isDeleting ? "Deleting..." : "Delete order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
