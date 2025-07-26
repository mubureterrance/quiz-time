interface ScoreDisplayProps {
  current: number;
  total: number;
}

export function ScoreDisplay({ current, total }: ScoreDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded shadow-md text-xs font-semibold">
      <span>{current}/{total}</span>
    </div>
  );
}