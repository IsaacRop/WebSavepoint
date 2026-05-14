import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink dark:bg-paper-100 text-paper-50 dark:text-night-900 border border-ink dark:border-paper-100 hover:bg-ink-90 dark:hover:bg-paper-200",
  secondary:
    "bg-transparent text-ink dark:text-paper-100 border border-ink dark:border-paper-100/40 hover:bg-ink/5 dark:hover:bg-paper-100/10",
  accent:
    "bg-terra text-paper-50 border border-terra hover:bg-terra-dark",
  ghost:
    "bg-transparent text-ink-70 dark:text-paper-400 border-none hover:text-ink dark:hover:text-paper-100",
  danger:
    "bg-transparent text-terra border border-terra hover:bg-terra/5 dark:hover:bg-terra/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className = "", disabled, children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          "font-mono uppercase tracking-widest",
          "transition-all duration-[200ms]",
          "inline-flex items-center justify-center cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
