"use client"
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  muted?: boolean; 
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  muted = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = "btn inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium shadow-md transition-all cursor-pointer";

  // const variantClasses = clsx({
  //   "bg-indigo-600 hover:bg-indigo-500 text-white": variant === "primary",
  //   "bg-white/10 hover:bg-white/15 border border-white/10 text-slate-100": variant === "secondary",
  // });

  const clickSound = new Audio("/sounds/click.mp3");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!muted) clickSound.play().catch(() => {});
    if (props.onClick) props.onClick(e);
  };

  return (
    <button {...props} onClick={handleClick} className={clsx(baseClasses, className)}>
      {children}
    </button>
  );
}
