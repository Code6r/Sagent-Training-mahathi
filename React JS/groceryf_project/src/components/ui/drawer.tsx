import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  title?: string;
  children: ReactNode;
}

const Drawer = ({
  open,
  onClose,
  side = "right",
  title,
  children
}: DrawerProps) => {
  const isRight = side === "right";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`fixed inset-y-0 z-50 w-full max-w-md ${
              isRight ? "right-0" : "left-0"
            } glass-panel flex flex-col`}
            initial={{ x: isRight ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRight ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {title && (
              <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold tracking-tight text-slate-900">
                {title}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;

