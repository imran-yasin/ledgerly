"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeletePayment } from "@/hooks";
import { toast } from "sonner";
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

export function DeletePaymentButton({ orderId, paymentId }: { orderId: string; paymentId: string }) {
  const deletePayment = useDeletePayment(orderId);
  const [open, setOpen] = useState(false);
  const isDeleting = deletePayment.isPending;

  function handleDelete() {
    deletePayment.mutate(paymentId, {
      onSuccess: () => {
        toast.success("Payment deleted");
        setOpen(false);
      },
      onError: () => toast.error("Failed to delete payment"),
    });
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-xs" onClick={() => setOpen(true)} disabled={isDeleting} className="text-muted-foreground hover:text-destructive">
            {isDeleting ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={14} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete this payment</TooltipContent>
      </Tooltip>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this payment?</AlertDialogTitle>
            <AlertDialogDescription>
              The payment will be removed and the order balance will be recalculated. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="animate-spin" size={14} />}
              {isDeleting ? "Deleting..." : "Delete payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
