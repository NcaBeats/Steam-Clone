interface ReadonlyProps {
  readonly children: React.ReactNode;
}

export const Header = ({ children }: ReadonlyProps) => {
  return (
    <header className="sticky top-0 z-50 bg-[#101014]/70 backdrop-blur-xl h-18">
      {children}
    </header>
  );
};
