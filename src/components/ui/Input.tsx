import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, id, className = "", ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-[11px] uppercase tracking-widest text-ink-50"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "font-sans text-base text-ink bg-transparent",
            "px-4 py-3 border",
            error ? "border-terra" : "border-ink-10",
            "focus:outline-none focus:border-ink",
            "placeholder:text-ink-10",
            "transition-colors duration-[120ms]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <span className="font-mono text-[12px] text-terra">{error}</span>
        )}
      </div>
    );
  }
);

export default Input;
