import { motion, AnimatePresence } from "framer-motion";
import { classed } from "~/utils/classed";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { nanoid } from "nanoid";

const AlertContainerV2 = classed.ul(
  "fixed top-3 inset-x-0 flex flex-col justify-center items-center z-50"
);

const AlertTemplateV2 = classed(
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
  }
);

export const Alert = classed(
  AlertTemplateV2,
  "absolute top-3 left-1/2 -translate-x-1/2"
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
        params?.duration ?? 6000
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

export const useAlertV2 = () => {
  return useAlertStore((state) => state, shallow);
};

export const AlertProviderV2 = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { alerts, remove } = useAlertV2();

  return (
    <>
      <AlertContainerV2>
        <AnimatePresence initial={false}>
          {alerts.map((t) => (
            <AlertTemplateV2
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
            </AlertTemplateV2>
          ))}
        </AnimatePresence>
      </AlertContainerV2>
      {children}
    </>
  );
};

// type PropsV2 = {
//   children?: React.ReactNode;
//   className?: string;
//   id?: string;
//   variant?: "error" | "warning" | "information" | "success"; // Represents the color of the alert
//   show?: boolean;
//   dissmiss?: boolean;
//   handleClose?: () => void;
// };

// const variantClasses = {
//   error: "bg-accent-red-regular",
//   warning: "bg-accent-yellow-regular",
//   information: "bg-accent-gray-regular",
//   success: "bg-accent-green-light",
// };
// const borderClasses = {
//   borderRadious: "",
//   borderColor: "",
//   borderStyle: "",
//   color: "",
//   padding: "",
//   display: "",
//   justifyContent: "between",
//   alignItems: "center",
// };

// export const AlertV2 = ({
//   children,
//   id = "",
//   variant = "warning",
//   show,
//   handleClose,
// }: PropsV2) => {
//   const backgroundColor = variantClasses[variant];

//   return (
//     <>
//       {show ? (
//         <div
//           className={`shadow-alert ${backgroundColor} text-white p-2 flex justify-between items-center`}
//           id={id}
//           // variant={variant}
//         >
//           <span> {children}</span>
//           <button onClick={handleClose}>
//             <span>x</span>
//           </button>
//         </div>
//       ) : null}
//     </>
//   );
// };
