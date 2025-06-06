import React from "react";
import { ArrowDownUp } from "lucide-react";

type SortControlsProps = {
  sortOrder: string;
  onSortChange: (newOrder: string) => void;
  filteredCount: number;
  totalCount: number;
};

const sortOptions = [
  { value: "alpha-asc", label: "Alphabetical (A-Z)" },
  { value: "alpha-desc", label: "Alphabetical (Z-A)" },
  { value: "unique-desc", label: "Unique Letters (Most to Least)" },
  { value: "unique-asc", label: "Unique Letters (Least to Most)" },
  { value: "vowels-desc", label: "Vowel Count (Most to Least)" },
  { value: "consonants-desc", label: "Consonant Count (Most to Least)" },
];

const SortControls: React.FC<SortControlsProps> = ({
  sortOrder,
  onSortChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      {/* Results Count */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
        Displaying{" "}
        <span className="font-bold text-gray-800 dark:text-gray-200">
          {filteredCount}
        </span>{" "}
        of {totalCount} words
      </p>

      {/* Sort Dropdown */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="sort-order"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <ArrowDownUp className="inline-block w-4 h-4 mr-1" />
          Sort by:
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortControls;
