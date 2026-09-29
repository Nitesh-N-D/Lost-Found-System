function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-stone-900 md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-stone-600">{description}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
