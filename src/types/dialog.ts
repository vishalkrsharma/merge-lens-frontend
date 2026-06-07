export enum EDialogType {
  ADD_REPO = "ADD_REPO",
}

export type TDialog = {
  type: EDialogType | null;
  isOpen: boolean;
  dialogData: unknown;
  onOpen: (args: { type: EDialogType; dialogData?: unknown }) => void;
  onClose: () => void;
};
