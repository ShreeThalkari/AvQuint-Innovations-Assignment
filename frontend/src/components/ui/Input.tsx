import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-300">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100
              placeholder:text-zinc-600
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              transition-all duration-200
              ${error ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}
              ${leftIcon ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
