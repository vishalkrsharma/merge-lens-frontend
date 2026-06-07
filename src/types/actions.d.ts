declare type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; status: number; message: string };
