"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShadcnButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

type CustomButtonProps = Omit<ShadcnButtonProps, "asChild"> & {
  children?: React.ReactNode;
  motionScale?: number;
  motionTapScale?: number;
};

export default function CustomButton({
  children,
  className,
  motionScale = 1.04,
  motionTapScale = 0.97,
  ...props
}: CustomButtonProps) {
  const isDisabled = !!props.disabled;

  return (
    <motion.div
      whileHover={isDisabled ? undefined : { scale: motionScale }}
      whileTap={isDisabled ? undefined : { scale: motionTapScale }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="inline-block"
    >
      <Button {...props} className={cn("will-change-transform", className)}>
        {children}
      </Button>
    </motion.div>
  );
}
