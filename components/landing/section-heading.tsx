type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center" ? "mx-auto items-center text-center" : "items-start text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignmentClass}`}>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#d3b373]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#f8f1e6] sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-slate-200/75">{description}</p>
    </div>
  );
}
