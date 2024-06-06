import React from "react";

export default function Text({ type, children, ...props }) {
  const typeClassMap = {
    success: "text-success",
    primary: "text-primary",
    error: "text-error",
    disabled: "text-disabled",
    warning: "text-warning",
  };

  var classes = typeClassMap[type] || typeClassMap.primary;

  return (
    <div {...props} className={`${classes} text-base`}>
      {children}
    </div>
  );
}
