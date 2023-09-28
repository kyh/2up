"use client";
import { motion, AnimatePresence } from "framer-motion";
import { classed } from "~/utils/classed";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { nanoid } from "nanoid";

const AlertContainer = classed.ul(
  "fixed top-3 inset-x-0 flex flex-col justify-center items-center z-50",
);

const AlertTemplate = classed(
  motion.li,
  "text-white",
  "flex items-center cursor-pointer",
  "p-3 rounded-wavy max-w-[500px]",
  "animate-[visible_0s_ease-linear_delay-100_forwards]",
  "z-50",
  {
    variants: {
      variant: {
        success: "bg-accent-green-light",
        error: "bg-accent-red-regular",
        info: "bg-accent-blue-regular",
      },
    },
  },
);

export const Alert = classed(
  AlertTemplate,
  "absolute top-3 left-1/2 -translate-x-1/2",
);

type AlertOptions = {
  type?: "success" | "error" | "info";
  duration?: number | false;
};

type AlertType = {
  id: string;
  message: React.ReactNode;
};

type AlertStore = {
  alerts: AlertType[];
  show: (message: React.ReactNode, params?: AlertOptions) => void;
  remove: (id: string) => void;
};

export const useAlertStore = create<AlertStore>()((set, get) => ({
  alerts: [],
  show: async (message: React.ReactNode, params?: AlertOptions) => {
    const id = nanoid();
    const remove = get().remove;

    set((store) => ({ ...store, alerts: [...store.alerts, { id, message }] }));

    if (params?.duration !== false) {
      setTimeout(
        () => {
          remove(id);
        },
        params?.duration ?? 6000,
      );
    }
  },
  remove: (id: string) => {
    set((store) => ({
      ...store,
      alerts: store.alerts.filter((t) => t.id !== id),
    }));
  },
}));

export const useAlerts = () => {
  return useAlertStore((state) => state, shallow);
};

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
  const { alerts, remove } = useAlerts();

  return (
    <>
      <AlertContainer>
        <AnimatePresence initial={false}>
          {alerts.map((t) => (
            <AlertTemplate
              onClick={() => remove(t.id)}
              key={t.id}
              layout
              variant="info"
              initial={{ opacity: 0, y: -30, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.5 },
              }}
            >
              {t.message}
            </AlertTemplate>
          ))}
        </AnimatePresence>
      </AlertContainer>
      {children}
    </>
  );
};
