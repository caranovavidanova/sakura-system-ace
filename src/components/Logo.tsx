interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <img
      src="/sakura-logo.svg"
      alt="Sakura System — by Sakura Corp"
      className={`h-auto w-full max-w-56 ${className}`}
    />
  );
}
