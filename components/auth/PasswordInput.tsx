import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  readonly name: string;
  readonly placeholder: string;
  readonly show: boolean;
  readonly onToggle: () => void;
  readonly defaultValue?: string;
  readonly className?: string;
}

export const PasswordInput = ({
  name,
  placeholder,
  show,
  onToggle,
  defaultValue,
  className,
}: PasswordInputProps) => {
  return (
    <label
      htmlFor={name}
      className={`flex relative items-center font-medium text-sm ${className}`}
    >
      <input
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required
        defaultValue={defaultValue}
        className="bg-[#1A1A1A] rounded-lg px-3 py-3 w-full hover:bg-[#272727] transition-colors duration-200 ease-out"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 text-[#8D8C8D] hover:bg-[#3a3a3a] p-1 transition-colors duration-200 ease-in rounded-lg"
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </label>
  );
};
