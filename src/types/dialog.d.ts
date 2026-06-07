declare type EDialogType = 'ADD_REPO';

declare type TDialog = {
  type: EDialogType | null;
  isOpen: boolean;
  dialogData: unknown;
  onOpen: (args: { type: EDialogType; dialogData?: unknown }) => void;
  onClose: () => void;
};
