interface ReadonlyProps {
  readonly children: React.ReactNode;
}

export const Header = ({ children }: ReadonlyProps) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] h-16">{children}</header>
  );
};
