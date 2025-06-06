import React from "react";

interface WordListProps {
  words: string[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  if (words.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
        No words match the current filters. 🤷
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {words.map((word, index) => (
        // The card is now an anchor tag `<a>`
        <a
          key={index}
          href={`https://www.dictionary.com/browse/${word}`}
          target="_blank" // Opens in a new tab
          rel="noopener noreferrer" // Security best practice
          className="bg-white dark:bg-slate-800 flex items-center justify-center p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:bg-slate-700 hover:-translate-y-1 transition-all duration-300"
          title={`Look up "${word}" on Dictionary.com`}
        >
          <p className="text-xl font-mono font-semibold text-gray-700 dark:text-gray-200 tracking-widest uppercase">
            {word}
          </p>
        </a>
      ))}
    </div>
  );
};

export default WordList;
