interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  noCommon: boolean;
}

interface PasswordStrength {
  label: string;
  color: string;
  score: number;
  checks: PasswordChecks;
}

const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    "password", "123456", "12345678", "qwerty", "abc123", 
    "password123", "admin", "letmein", "welcome", "monkey",
  ];
  return commonPasswords.includes(password.toLowerCase());
};

const getPasswordStrength = (pw: string): PasswordStrength => {
  let score = 0;
  const checks: PasswordChecks = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    noCommon: !isCommonPassword(pw),
  };

  Object.values(checks).forEach((check) => {
    if (check) score++;
  });

  if (pw.length === 0) return { label: "", color: "", score: 0, checks };
  if (score <= 2) return { label: "Weak", color: "bg-red-400", score, checks };
  if (score <= 4) return { label: "Medium", color: "bg-yellow-400", score, checks };
  return { label: "Strong", color: "bg-green-500", score, checks };
};

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" id="password-strength">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password Strength:
        </span>
        <span
          className={`text-sm font-medium ${
            strength.label === "Weak"
              ? "text-red-600 dark:text-red-400"
              : strength.label === "Medium"
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {strength.label}
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 6) * 100}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-2 gap-1">
          <CheckItem checked={strength.checks.length} text="8+ characters" />
          <CheckItem checked={strength.checks.uppercase} text="Uppercase letter" />
          <CheckItem checked={strength.checks.lowercase} text="Lowercase letter" />
          <CheckItem checked={strength.checks.number} text="Number" />
          <CheckItem checked={strength.checks.special} text="Special character" />
          <CheckItem checked={strength.checks.noCommon} text="Not common password" />
        </div>
      </div>
    </div>
  );
};

const CheckItem = ({ checked, text }: { checked: boolean; text: string }) => (
  <div className={checked ? "text-green-600 dark:text-green-400" : "text-gray-400"}>
    ✓ {text}
  </div>
);