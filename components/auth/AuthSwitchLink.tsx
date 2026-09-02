import Link from "next/link";

interface AuthSwitchLinkProps {
  readonly text: string;
  readonly href: string;
  readonly linkText: string;
}

export const AuthSwitchLink = ({
  text,
  href,
  linkText,
}: AuthSwitchLinkProps) => {
  return (
    <p className="text-[#8A8A8A] flex justify-center text-sm items-center-safe gap-2 font-medium">
      {text}
      <span>
        <Link
          className="text-white hover:text-[#007AFF] hover:underline active:underline active:text-[#007AFF]"
          href={href}
        >
          {linkText}
        </Link>
      </span>
    </p>
  );
};
