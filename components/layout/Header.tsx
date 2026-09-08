interface ReadonlyProps {
  readonly children: React.ReactNode;
}

export const Header = ({ children }: ReadonlyProps) => {
  return (
    <header className="sticky top-0 z-50 bg-[#101014] h-[72px]">
      {children}
    </header>
  );
};
