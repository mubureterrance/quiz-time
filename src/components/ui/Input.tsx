import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-900 ${className}`}
    {...props}
  />
);

export default Input; 