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
      className={`font-medium text-sm text-center rounded-md px-2.5 py-1.5 cursor-pointer transition-colors duration-250 ease-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
