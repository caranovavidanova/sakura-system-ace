interface LogoProps {
  iconSize?: number;
  className?: string;
}

export function Logo({ iconSize = 36, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/sakura-icon.svg"
        alt=""
        style={{ height: iconSize, width: iconSize }}
      />
      <img
        src="/sakura-wordmark.svg"
        alt="Sakura System — by Sakura Corp"
        style={{ height: iconSize * 1.1 }}
      />
    </div>
  );
}
