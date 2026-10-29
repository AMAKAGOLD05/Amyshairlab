import { formatNaira } from "@/lib/money";

export function Price({
  amount,
  compareAt,
  from = false,
  className = "",
}: {
  amount: number;
  compareAt?: number | null;
  from?: boolean;
  className?: string;
}) {
  const reduced = compareAt != null && compareAt > amount;
  return (
    <p className={`text-sm text-ink ${className}`}>
      {from ? <span className="text-muted">From </span> : null}
      <span>{formatNaira(amount)}</span>
      {reduced ? (
        <span className="ml-2 text-muted line-through">{formatNaira(compareAt)}</span>
      ) : null}
    </p>
  );
}
