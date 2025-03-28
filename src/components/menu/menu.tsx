import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

type MenuProps = {
  isMenuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  extraTop?: boolean;
  editLabel?: string; // Añadir esta línea
  deleteLabel?: string; // Añadir esta línea
};

export default function Menu({
  setMenuOpen,
  isMenuOpen,
  onEdit,
  onDelete,
  extraTop = false,
  editLabel = "Edit", // Valor por defecto
  deleteLabel = "Delete", // Valor por defecto
}: MenuProps) {
  const desktopModalRef = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    },
    [setMenuOpen]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        desktopModalRef.current &&
        !desktopModalRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    },
    [setMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onKeyDown, handleClickOutside]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          ref={desktopModalRef}
          key="desktop-modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`absolute right-3 ${
            extraTop ? "mt-16" : "mt-2"
          } w-48 bg-white border border-slate-300 rounded-md shadow-lg z-10`}
        >
          <button
            className="block border-b w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-t-md"
            onClick={() => {
              setMenuOpen(false);
              if (onEdit) onEdit();
            }}
          >
            {editLabel}
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-slate-50 rounded-b-md"
            onClick={() => {
              setMenuOpen(false);
              if (onDelete) onDelete();
            }}
          >
            {deleteLabel}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
