// Tiny toast helper — fires custom events that the ToastContainer listens for.
// This avoids pulling in a full library while keeping components decoupled.

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

const TOAST_EVENT = "app:toast";

function emit(type: ToastType, message: string) {
  const detail: ToastMessage = {
    id: `${Date.now()}-${Math.random()}`,
    type,
    message,
  };
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}

export const toast = {
  success: (msg: string) => emit("success", msg),
  error: (msg: string) => emit("error", msg),
  info: (msg: string) => emit("info", msg),
  EVENT: TOAST_EVENT,
};
