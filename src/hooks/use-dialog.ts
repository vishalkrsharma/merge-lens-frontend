import { create } from 'zustand';

export const useDialog = create<TDialog>((set) => ({
  type: null,
  isOpen: false,
  dialogData: null,
  onOpen: ({ type, dialogData }: { type: EDialogType; dialogData?: unknown }) =>
    set({ type, isOpen: true, dialogData }),
  onClose: () => set({ isOpen: false, dialogData: null }),
}));
