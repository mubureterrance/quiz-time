import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "../ui/Input";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  showStrength?: boolean;
  confirmValue?: string;
}

export const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  showStrength = false,
  confirmValue,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const showMismatchError =
    confirmValue !== undefined &&
    confirmValue &&
    value &&
    confirmValue !== value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className="pl-10 pr-10 w-full"
          placeholder={placeholder}
          aria-describedby={showStrength ? "password-strength" : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {showMismatchError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Passwords do not match
        </p>
      )}
    </div>
  );
};
