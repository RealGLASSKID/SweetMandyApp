import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 34, text: "text-lg" },
  lg: { icon: 44, text: "text-2xl" },
};

export function Logo({ className, showWordmark = true, size = "md" }: LogoProps) {
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <circle cx="32" cy="32" r="30" fill="url(#smGlow)" opacity="0.35" />
        <circle cx="32" cy="32" r="20" fill="url(#smSun)" />
        <path
          d="M22 34c2-8 8-12 14-12s12 4 14 12c-3-4-8-6-14-6s-11 2-14 6z"
          fill="#1a080c"
          opacity="0.9"
        />
        <path
          d="M26 36c1.5-4 5-6 8-6s6.5 2 8 6"
          stroke="#FBBF24"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40 24c0-1.5 1.2-2.5 2.5-2.5S45 22.5 45 24c0 2-2.5 4-2.5 4S40 26 40 24z"
          fill="#FDE68A"
        />
        <defs>
          <linearGradient id="smSun" x1="12" y1="12" x2="52" y2="52">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
          <radialGradient id="smGlow" cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      {showWordmark && (
        <span className={cn("font-display font-semibold tracking-tight text-foreground", s.text)}>
          Sweet <span className="text-primary">Mandy</span>
        </span>
      )}
    </span>
  );
}
