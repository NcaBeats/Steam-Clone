import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui";

interface PasswordInputProps {
  readonly name: string;
  readonly placeholder: string;
  readonly show: boolean;
  readonly onToggle: () => void;
  readonly defaultValue?: string;
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly className?: string;
  readonly inputClassName?: string;
}

export const PasswordInput = ({
  name,
  placeholder,
  show,
  onToggle,
  defaultValue,
  required = true,
  minLength,
  maxLength,
  className,
  inputClassName,
}: PasswordInputProps) => {
  return (
    <label
      htmlFor={name}
      className={`flex relative items-center font-medium text-sm ${className}`}
    >
      <Input
        id={name}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        minLength={minLength}
        maxLength={maxLength}
        className={`pr-10 ${inputClassName ?? ""}`}
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
