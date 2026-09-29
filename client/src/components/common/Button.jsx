import { classNames } from "../../utils/classNames";

function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "primary-button hover:-translate-y-0.5",
    secondary:
      "secondary-button border",
    ghost:
      "border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200",
    danger:
      "bg-rose-500 text-stone-900 hover:bg-rose-600",
  };

  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium tracking-[0.01em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
