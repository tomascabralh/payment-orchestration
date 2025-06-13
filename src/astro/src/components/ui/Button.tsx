import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  "data-testid"?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  "data-testid": dataTestId,
  ...props
}) => (
  <button
    {...props}
    className={
      "w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed " +
      (props.className || "")
    }
    data-testid={dataTestId || "ui-button"}
  >
    {children}
  </button>
);
