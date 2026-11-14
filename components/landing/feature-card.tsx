import Image from "next/image";
import Link from "next/link";

type FeatureCardProps = {
  title: string;
  description: string;
  image: string;
  accent: string;
  href: string;
};

export function FeatureCard({
  title,
  description,
  image,
  accent,
  href,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1f2a]/80 shadow-[0_24px_60px_rgba(3,17,25,0.45)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#061c26]"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03161d]/85 via-[#03161d]/20 to-transparent" />
        <span
          className={`absolute left-5 top-5 rounded-full border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] ${accent}`}
        >
          {title}
        </span>
      </div>

      <div className="space-y-3 p-6">
        <h3 className="text-xl font-semibold text-[#f5efe3]">{title}</h3>
        <p className="text-sm leading-7 text-slate-200/75">{description}</p>
        <span className="inline-flex items-center gap-2 pt-2 text-xs font-medium uppercase tracking-[0.2em] text-[#d3b373]">
          Enter this landscape
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
