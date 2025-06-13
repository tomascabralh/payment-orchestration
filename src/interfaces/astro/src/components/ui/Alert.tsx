import React from "react";

interface AlertProps {
  type: "success" | "error";
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type, children }) => {
  const base = "px-4 py-3 rounded-lg mb-4 ";
  const color =
    type === "success"
      ? "bg-green-50 border border-green-200 text-green-700"
      : "bg-red-50 border border-red-200 text-red-700";
  return <div className={`${base} ${color}`}>{children}</div>;
};
