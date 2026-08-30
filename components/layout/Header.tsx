interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return (
    <header className="sticky border-b-2 z-50 border-none bg-[#161617] h-16">
      {children}
    </header>
  );
};
