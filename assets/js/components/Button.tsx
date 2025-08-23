import React from "react";
import { Loader2 } from "lucide-react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  as?: "button" | "a"; // anchor로도 쓸 수 있게
  href?: string; // as="a"일 때 사용
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  className,
  children,
  as = "button",
  href,
  type,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-ag transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ag-primary-100/50 " +
    "focus-visible:ring-offset-1 focus-visible:ring-offset-white " +
    "disabled:opacity-50 disabled:cursor-not-allowed phx-click-loading:opacity-70";

  const variants: Record<Variant, string> = {
    primary: "bg-ag-primary-50 hover:bg-ag-primary-100 text-white",
    secondary: "bg-ag-gray-200 hover:bg-ag-gray-300 text-ag-gray-900",
    outline:
      "border border-ag-gray-300 bg-white hover:bg-ag-gray-50 text-ag-gray-900",
    ghost: "bg-transparent hover:bg-ag-gray-100 text-ag-gray-700",
    danger: "bg-ag-error hover:brightness-95 text-white",
    link: "bg-transparent text-ag-primary-100 hover:underline px-0",
  };

  const sizes: Record<Size, string> = {
    sm: "px-3 py-2 ag-body-12-m",
    md: "px-4 py-2 ag-body-14-m",
    lg: "px-5 py-3 ag-body-16-r",
  };

  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  const classes = cx(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {(loading || leftIcon) && (
        <span className={cx("inline-flex", iconSize)}>
          {loading ? (
            <Loader2 className={cx(iconSize, "animate-spin")} />
          ) : (
            leftIcon
          )}
        </span>
      )}
      <span className="truncate">{children}</span>
      {rightIcon && (
        <span className={cx("inline-flex", iconSize)}>{rightIcon}</span>
      )}
    </>
  );

  if (as === "a") {
    return (
      <a
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
