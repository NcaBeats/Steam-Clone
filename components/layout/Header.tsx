interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return (
    <header className=" sticky top-0 border-b-2 z-50 border-none bg-[#0A0A0A] h-16">
      {children}
    </header>
  );
};
