import React from "react";

export default function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>
      {children}
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </label>
  );
}
