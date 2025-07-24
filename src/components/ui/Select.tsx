import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<SelectProps> = ({
  className = "",
  children,
  ...props
}) => (
  <select
    className={`px-3 py-1 border rounded text-sm  dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default Select;
