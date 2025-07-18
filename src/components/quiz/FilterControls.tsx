import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import React from "react";
import type { Badge } from "../../hooks/useBadges";

interface FilterControlsProps {
  searchTerm: string;
  selectedBadgeFilter: string;
  badges: Badge[];
  onSearchChange: (value: string) => void;
  onBadgeFilterChange: (value: string) => void;
  onClearFilters: () => void;
  totalQuizzes: number;
  filteredCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  selectedBadgeFilter,
  badges,
  onSearchChange,
  onBadgeFilterChange,
  onClearFilters,
  totalQuizzes,
  filteredCount,
}: FilterControlsProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Search quizzes by title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Badge Filter */}
      <div className="lg:w-64">
        <Select
          value={selectedBadgeFilter}
          onChange={(e) => onBadgeFilterChange(e.target.value)}
          className="w-full dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="" className="dark:bg-gray-900 dark:text-gray-100">All Badges</option>
          {badges.map((badge) => (
            <option key={badge.id} value={badge.id} className="dark:bg-gray-900 dark:text-gray-100">
              {badge.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || selectedBadgeFilter) && (
        <Button
          onClick={onClearFilters}
          className="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-600"
        >
          Clear Filters
        </Button>
      )}
    </div>

    {/* Results Summary */}
    <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
      <span>
        Showing {filteredCount} of {totalQuizzes} quizzes
        {(searchTerm || selectedBadgeFilter) && " (filtered)"}
      </span>
      {selectedBadgeFilter && (
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
          Filter: {badges.find((b) => b.id === selectedBadgeFilter)?.name}
        </span>
      )}
    </div>
  </div>
);

export default FilterControls; 