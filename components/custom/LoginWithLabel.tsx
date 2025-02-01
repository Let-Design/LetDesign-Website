import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEventHandler, FocusEventHandler } from "react";

interface InputProps {
  type: string;
  label: string;
  name?: string;
  placeholder?: string;
  value?: number | string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

const InputWithLabel: React.FC<InputProps> = ({
  type,
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={label}>
        {label.charAt(0).toUpperCase() + label.slice(1, label.length)}
      </Label>
      <Input
        id={label}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputWithLabel;
