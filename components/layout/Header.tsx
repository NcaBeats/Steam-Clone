interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return (
    <header className="sticky border-b border-b-[#2020205f] border-solid bg-[#0A0A0A]">
      {children}
    </header>
  );
};
