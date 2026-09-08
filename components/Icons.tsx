type IconProps = { className?: string };

export function HeartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StethoscopeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4v6a4 4 0 0 0 8 0V4M6 4H4M14 4h2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M18 11a3 3 0 1 0 0 6h1a3 3 0 0 1 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="18" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function LabIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3v7L5 18a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 18l-4-8V3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8 3h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function BrainIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 5.5a3 3 0 0 1 5.5-1.2A3 3 0 0 1 19 7.5c0 4-3 6-7 10-4-4-7-6-7-10a3 3 0 0 1 3.5-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function BoneIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 8a2.2 2.2 0 1 1 3-3l7 7a2.2 2.2 0 1 1-3 3L7 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M8.2 5.2a2.2 2.2 0 1 0-3.1 3.1M18.8 15.7a2.2 2.2 0 1 0 3.1 3.1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function BabyIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 20c.8-2.6 2.7-4 5-4s4.2 1.4 5 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const map = {
  heart: HeartIcon,
  stethoscope: StethoscopeIcon,
  lab: LabIcon,
  brain: BrainIcon,
  bone: BoneIcon,
  baby: BabyIcon,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: keyof typeof map;
  className?: string;
}) {
  const Icon = map[name];
  return <Icon className={className} />;
}
