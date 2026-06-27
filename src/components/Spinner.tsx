import { memo } from "react";

interface SpinnerProps {
  label: string;
}

function Spinner({ label }: SpinnerProps) {
  return (
    <div className="spinner-row" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true"></span>
      <span>{label}</span>
    </div>
  );
}

export default memo(Spinner);
