import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { theme } from "styles/theme";
import { visible } from "styles/animations";

const AlertContainer = styled.ul`
  position: fixed;
  top: ${theme.spacings(3)};
`;

const AlertTemplate = styled(motion.li)`
  color: ${theme.ui.alertText};
  background: ${theme.ui.alertBackground};
  padding: ${theme.spacings(3)};
  border-radius: ${theme.ui.borderWavyRadius};
  display: flex;
  align-items: flex-start;
  animation: ${visible} 0s linear 0.1s forwards;
  visibility: hidden;
`;

export const Alert = styled(AlertTemplate)`
  position: absolute;
  top: ${theme.spacings(3)};
`;

type AlertOptions = {
  type?: "success" | "error" | "info";
  duration?: number | false;
};

type AlertType = {
  id: string;
  message: React.ReactNode;
};

export const AlertContext = createContext<{
  show: (message: React.ReactNode, params?: AlertOptions) => string | void;
  remove: (id: string) => void;
}>({
  show: () => {},
  remove: () => {},
});

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const show = (message: React.ReactNode, params?: AlertOptions) => {
    const id = Math.random().toString();
    setAlerts((prev) => [...prev, { id, message }]);

    if (params?.duration !== false) {
      setTimeout(() => {
        remove(id);
      }, params?.duration ?? 10000);
    }

    return id;
  };

  const remove = (id: string) => {
    setAlerts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AlertContext.Provider value={{ show, remove }}>
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
    </AlertContext.Provider>
  );
};
