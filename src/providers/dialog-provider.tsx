"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDialog } from "@/hooks/use-dialog";

export function DialogProvider() {
  const pathname = usePathname();
  const { onClose } = useDialog();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return null;
}
