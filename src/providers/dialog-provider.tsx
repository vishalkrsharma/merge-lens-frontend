"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDialog } from "@/hooks/use-dialog";

export function DialogProvider() {
  const _pathname = usePathname();
  const { onClose } = useDialog();

  useEffect(() => {
    onClose();
  }, [onClose]);

  return null;
}
