"use client";
import { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function Container({
  children,
  className = "",
  id = "",
}: ContainerProps) {
  return (
    <div
      className={`max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-9 ${className}`}
      id={id}
    >
      {children}
    </div>
  );
}
