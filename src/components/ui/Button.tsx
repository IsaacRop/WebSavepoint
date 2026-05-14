import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-paper-50 border border-ink hover:bg-ink-90",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink/5",
  accent:
    "bg-terra text-paper-50 border border-terra hover:bg-terra-dark",
  ghost:
    "bg-transparent text-ink-70 border-none hover:text-ink",
  danger:
    "bg-transparent text-terra border border-terra hover:bg-terra/5",
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
