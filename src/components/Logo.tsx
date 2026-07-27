interface LogoProps {
  iconSize?: number;
  className?: string;
}

export function Logo({ iconSize = 36, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/sakura-icon.svg"
        alt="Sakura System"
        style={{ height: iconSize, width: iconSize }}
      />
      <div className="leading-tight">
        <p className="font-serif text-lg italic font-semibold text-sakura-purple-dark">
          Sakura System
        </p>
        <p className="font-serif text-xs italic text-sakura-gray">by Sakura Corp</p>
      </div>
    </div>
  );
}
