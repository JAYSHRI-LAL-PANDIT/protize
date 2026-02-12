import { useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  open?: boolean;
  onToggle?: () => void;
  className?: string;
};

export default function HamburgerMenu({
  open: openProp,
  onToggle,
  className,
}: Props) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;

  const toggleRef = useRef<HTMLDivElement | null>(null);

  const barCommon =
    "h-[2px] rounded-full bg-neutral-900 dark:bg-white origin-center";

  const handleToggle = () => {
    if (onToggle) return onToggle();
    setOpenState((prev) => !prev);
  };

  return (
    <motion.div
      ref={toggleRef}
      role="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      tabIndex={0}
      className={`md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 p-2 cursor-pointer select-none ${className ?? ""}`}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleToggle();
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Top bar */}
      <motion.div
        className={`${barCommon} w-6`}
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 6 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />

      {/* Middle bar */}
      <motion.div
        className={`${barCommon} w-6`}
        animate={{
          opacity: open ? 0 : 1,
          scaleX: open ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Bottom bar */}
      <motion.div
        className={`${barCommon} w-6`}
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -6 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
    </motion.div>
  );
}
