import Button from "../ui/Button";

type FilterType = "all" | "recent" | "best";

interface FilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  const tabs = [
    { key: "all" as const, label: "All Quizzes" },
    { key: "recent" as const, label: "Recent" },
    { key: "best" as const, label: "Best Scores" }
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {tabs.map((tab) => (
        <FilterTab
          key={tab.key}
          isActive={filter === tab.key}
          onClick={() => onFilterChange(tab.key)}
          label={tab.label}
        />
      ))}
    </div>
  );
}

interface FilterTabProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

function FilterTab({ isActive, onClick, label }: FilterTabProps) {
  return (
    <Button
      onClick={onClick}
      className={`${
        isActive 
          ? "bg-blue-600 text-white" 
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </Button>
  );
}