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
      "bg-white text-slate-950 shadow-sm shadow-black/10 hover:-translate-y-0.5 hover:bg-slate-100",
    secondary:
      "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]",
    ghost:
      "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800",
    danger:
      "bg-rose-500 text-white hover:bg-rose-600",
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
