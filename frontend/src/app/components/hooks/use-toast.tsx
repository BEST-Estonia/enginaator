"use client";
import * as React from "react";
import type {
  ToastActionElement,
  ToastProps,
} from "../ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 10000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type ToastContextType = {
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id">) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

function genId() {
  // substr is deprecated, use substring instead
  return Math.random().toString(36).substring(2, 11);
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: ToasterToast }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

function toastReducer(state: ToasterToast[], action: ToastAction): ToasterToast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [action.toast, ...state].slice(0, TOAST_LIMIT);
    case "UPDATE_TOAST":
      return state.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t));
    case "DISMISS_TOAST":
      return state.map((t) =>
        t.id === action.toastId || action.toastId === undefined
          ? { ...t, open: false }
          : t
      );
    case "REMOVE_TOAST":
      if (action.toastId === undefined) return [];
      return state.filter((t) => t.id !== action.toastId);
    default:
      return state;
  }
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, dispatch] = React.useReducer(toastReducer, []);

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
      }, TOAST_REMOVE_DELAY)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  function toast(props: Omit<ToasterToast, "id">) {
    const id = genId();
    const update = (props: ToasterToast) =>
      dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) dismiss();
        },
      },
    });
    return { id, dismiss, update };
  }

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
