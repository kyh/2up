import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { nanoid } from "nanoid";
import { theme } from "~/styles/theme";
import { visible } from "~/styles/animations";

const AlertContainer = styled.ul`
  position: fixed;
  top: ${theme.spacings(3)};
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 10;
`;

const AlertTemplate = styled(motion.li)`
  color: ${theme.ui.alertText};
  background: ${theme.ui.alertBackground};
  padding: ${theme.spacings(3)};
  border-radius: ${theme.ui.borderWavyRadius};
  max-width: 500px;
  display: flex;
  align-items: flex-start;
  animation: ${visible} 0s linear 0.1s forwards;
  visibility: hidden;
  cursor: pointer;
`;

export const Alert = styled(AlertTemplate)`
  position: absolute;
  top: ${theme.spacings(3)};
  left: 50%;
  transform: translateX(-50%);
`;

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
      setTimeout(() => {
        remove(id);
      }, params?.duration ?? 6000);
    }
  },
  remove: (id: string) => {
    set((store) => ({
      ...store,
      alerts: store.alerts.filter((t) => t.id !== id),
    }));
  },
}));

export const useAlert = () => {
  return useAlertStore((state) => state, shallow);
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const { alerts, remove } = useAlert();

  return (
    <>
      <AlertContainer>
        <AnimatePresence initial={false}>
          {alerts.map((t) => (
            <AlertTemplate
              onClick={() => remove(t.id)}
              key={t.id}
              layout
              initial={{ opacity: 0, y: -30, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
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
