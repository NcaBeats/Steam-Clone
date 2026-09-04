"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type AlertVariant = "default" | "destructive";

export type AlertItem = {
  id: number;
  variant: AlertVariant;
  title: string;
  description?: string;
};

type AlertContextValue = {
  alerts: AlertItem[];
  showAlert: (alert: Omit<AlertItem, "id">) => void;
  dismissAlert: (id: number) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export const useAlert = (): AlertContextValue => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return ctx;
};

const ALERT_DURATION_MS = 3000;
const EXIT_ANIMATION_MS = 300;

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [dismissingIds, setDismissingIds] = useState<Set<number>>(new Set());
  const idRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setDismissingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismissAlert = useCallback(
    (id: number) => {
      setDismissingIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      const exitTimer = setTimeout(() => {
        removeAlert(id);
      }, EXIT_ANIMATION_MS);
      timersRef.current.set(id, exitTimer);
    },
    [removeAlert],
  );

  const showAlert = useCallback(
    (alert: Omit<AlertItem, "id">) => {
      idRef.current += 1;
      const id = idRef.current;
      setAlerts((prev) => [...prev, { ...alert, id }]);
      const autoTimer = setTimeout(() => {
        dismissAlert(id);
      }, ALERT_DURATION_MS);
      timersRef.current.set(id, autoTimer);
    },
    [dismissAlert],
  );

  return (
    <AlertContext.Provider value={{ alerts, showAlert, dismissAlert }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 w-auto sm:w-full sm:max-w-sm pointer-events-none"
      >
        {alerts.map((alert) => (
          <AlertItemView
            key={alert.id}
            alert={alert}
            dismissing={dismissingIds.has(alert.id)}
            onDismiss={() => dismissAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

const AlertItemView = ({
  alert,
  dismissing,
  onDismiss,
}: {
  alert: AlertItem;
  dismissing: boolean;
  onDismiss: () => void;
}) => {
  const Icon = alert.variant === "destructive" ? AlertCircle : CheckCircle2;
  return (
    <div
      data-state={dismissing ? "closed" : "open"}
      className="pointer-events-auto data-[state=open]:tw-animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-full data-[state=closed]:tw-animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full duration-300"
      style={{
        animation: dismissing
          ? "alert-out 300ms ease-in forwards"
          : "alert-in 300ms ease-out",
      }}
    >
      <Alert variant={alert.variant} className="shadow-lg">
        <Icon className="size-4" />
        <AlertTitle>{alert.title}</AlertTitle>
        {alert.description && (
          <AlertDescription>{alert.description}</AlertDescription>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute top-2 right-2 text-current opacity-70 hover:opacity-100 cursor-pointer"
        >
          <X size={16} />
        </button>
      </Alert>
    </div>
  );
};
