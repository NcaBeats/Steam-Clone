type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`font-semibold text-center rounded-md px-4 py-1 cursor-pointer transition-colors duration-150 ease-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
