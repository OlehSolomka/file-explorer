interface TreeNodeDetailProps {
  label: string;
  value: string;
}

export const TreeNodeDetailRow = ({ label, value }: TreeNodeDetailProps) => (
  <div className="border-border flex items-baseline gap-4 border-b py-3 last:border-0">
    <span className="type-body-xs text-content-secondary w-36 shrink-0 font-semibold tracking-wide uppercase">
      {label}
    </span>
    <span className="type-body-s text-content-primary break-all">{value}</span>
  </div>
);
