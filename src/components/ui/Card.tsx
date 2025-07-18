import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 p-4 rounded shadow dark:text-gray-100 ${className}`}>{children}</div>
);

export default Card; 