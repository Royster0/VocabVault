import React from "react";
import { X, Dices } from "lucide-react";

type RandomWordDisplayProps = {
  word: string;
  onDismiss: () => void;
};

const RandomWordDisplay: React.FC<RandomWordDisplayProps> = ({
  word,
  onDismiss,
}) => {
  const dictionaryUrl = `https://www.dictionary.com/browse/${word}`;

  return (
    <div className="relative bg-indigo-600 dark:bg-indigo-500 text-white p-6 rounded-lg mb-8 shadow-2xl animate-fade-in-down">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss random word"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="text-center">
        <h3 className="text-sm uppercase tracking-widest font-semibold text-indigo-200 flex items-center justify-center">
          <Dices className="w-4 h-4 mr-2" />
          Your Random Word
        </h3>
        <a
          href={dictionaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-5xl font-bold font-mono tracking-widest my-2 uppercase hover:text-yellow-300 transition-colors"
          title="Look up on Dictionary.com"
        >
          {word}
        </a>
      </div>
    </div>
  );
};

export default RandomWordDisplay;
