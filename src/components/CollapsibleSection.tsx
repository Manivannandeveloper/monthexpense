import React, { useState } from "react";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  className = "",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className={className}>
      <div
        className="flex items-center justify-between bg-blue-100 p-2 rounded cursor-pointer"
        role="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="text-black font-semibold">{title}</div>
        <div className="text-black text-sm">{open ? "▾" : "▸"}</div>
      </div>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
