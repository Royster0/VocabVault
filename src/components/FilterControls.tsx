import React from "react";
import { SlidersHorizontal, RefreshCw } from "lucide-react";

export interface Filters {
  startsWith: string;
  endsWith: string;
  contains: string;
  notContaining: string;
  uniqueLetters: string;
  isPalindrome: boolean;
  atPosition: string[];
}

interface FilterControlsProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (
      (name === "contains" || name === "notContaining") &&
      !/^[a-zA-Z]*$/.test(value)
    ) {
      return;
    }

    const newValue = type === "checkbox" ? checked : value;
    onFilterChange({ ...filters, [name]: newValue });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, uniqueLetters: e.target.value });
  };

  const handlePositionChange = (index: number, value: string) => {
    const newAtPosition = [...filters.atPosition];
    newAtPosition[index] = value.toLowerCase().charAt(0);
    onFilterChange({ ...filters, atPosition: newAtPosition });
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <SlidersHorizontal className="mr-3 text-indigo-500" /> Advanced
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField
            label="Beginning with"
            name="startsWith"
            value={filters.startsWith}
            onChange={handleInputChange}
          />
          <InputField
            label="Ending with"
            name="endsWith"
            value={filters.endsWith}
            onChange={handleInputChange}
          />
          <InputField
            label="Containing (all of)"
            name="contains"
            value={filters.contains}
            onChange={handleInputChange}
          />
          <InputField
            label="Not containing (any of)"
            name="notContaining"
            value={filters.notContaining}
            onChange={handleInputChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              At position
            </label>
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={filters.atPosition[i]}
                  onChange={(e) => handlePositionChange(i, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-bold border-2 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              ))}
            </div>
          </div>

          <SelectField
            label="Unique letters"
            value={filters.uniqueLetters}
            onChange={handleSelectChange}
            options={[
              { value: "", label: "Any" },
              { value: "5", label: "5 Letters" },
              { value: "4", label: "4 Letters" },
              { value: "3", label: "3 Letters" },
              { value: "2", label: "2 Letters" },
              { value: "1", label: "1 Letter" },
            ]}
          />

          <CheckboxField
            label="Find Palindromes Only"
            name="isPalindrome"
            checked={filters.isPalindrome}
            onChange={handleInputChange}
          />

          <div className="flex items-end">
            <button
              onClick={onReset}
              className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center h-12"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for different field types
const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}> = ({ label, name, value, onChange, maxLength }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="h-12 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="h-12 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField: React.FC<{
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, checked, onChange }) => (
  <div className="flex items-end h-full pb-1">
    <label
      htmlFor={name}
      className="flex items-center space-x-3 cursor-pointer"
    >
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </label>
  </div>
);

export default FilterControls;
