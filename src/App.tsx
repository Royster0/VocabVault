import { useState, useEffect, useMemo } from "react";
import RandomWordDisplay from "./components/RandomWordDisplay";
import FilterControls, { type Filters } from "./components/FilterControls";
import SortControls from "./components/SortControls";
import WordList from "./components/WordList";
import Pagination from "./components/Pagination";
import ThemeToggle from "./components/ThemeToggle";
import { BookOpenText, LoaderCircle } from "lucide-react";

const WORDS_PER_PAGE = 50;
type Theme = "light" | "dark";

const initialFilters: Filters = {
  startsWith: "",
  endsWith: "",
  contains: "",
  notContaining: "",
  uniqueLetters: "",
  isPalindrome: false,
  atPosition: Array(5).fill(""),
};

const countUnique = (word: string) => new Set(word).size;
const countVowels = (word: string) => word.match(/[aeiou]/gi)?.length || 0;
const countConsonants = (word: string) => word.match(/[^aeiou]/gi)?.length || 0;

function App() {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<string>("alpha-asc");
  const [randomWord, setRandomWord] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("/words.txt");
        if (!response.ok) throw new Error("Network response was not ok");
        const text = await response.text();
        const wordsArray = text
          .split(/\r?\n/)
          .filter((word) => word.length === 5);
        setAllWords(wordsArray);
        setFilteredWords(wordsArray);
      } catch (err) {
        console.error("Failed to fetch words:", err);
        setError("Could not load word list.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    let words = [...allWords];

    const lowercasedFilters = {
      ...filters,
      startsWith: filters.startsWith.toLowerCase(),
      endsWith: filters.endsWith.toLowerCase(),
      contains: filters.contains.toLowerCase(),
      notContaining: filters.notContaining.toLowerCase(),
      atPosition: filters.atPosition.map((char) => char.toLowerCase()),
    };

    words = words.filter((word) => {
      if (
        lowercasedFilters.startsWith &&
        !word.startsWith(lowercasedFilters.startsWith)
      )
        return false;
      if (
        lowercasedFilters.endsWith &&
        !word.endsWith(lowercasedFilters.endsWith)
      )
        return false;
      for (let i = 0; i < 5; i++) {
        if (
          lowercasedFilters.atPosition[i] &&
          word[i] !== lowercasedFilters.atPosition[i]
        )
          return false;
      }
      if (
        lowercasedFilters.contains &&
        !lowercasedFilters.contains
          .split("")
          .every((char) => word.includes(char))
      )
        return false;
      if (
        lowercasedFilters.notContaining &&
        lowercasedFilters.notContaining
          .split("")
          .some((char) => word.includes(char))
      )
        return false;
      if (
        lowercasedFilters.uniqueLetters &&
        new Set(word).size !== parseInt(lowercasedFilters.uniqueLetters, 10)
      )
        return false;
      if (
        lowercasedFilters.isPalindrome &&
        word !== word.split("").reverse().join("")
      )
        return false;
      return true;
    });

    setFilteredWords(words);
    setCurrentPage(1);
  }, [filters, allWords, isLoading]);

  const sortedWords = useMemo(() => {
    const sortable = [...filteredWords];
    switch (sortOrder) {
      case "alpha-desc":
        return sortable.sort((a, b) => b.localeCompare(a));
      case "unique-desc":
        return sortable.sort((a, b) => countUnique(b) - countUnique(a));
      case "unique-asc":
        return sortable.sort((a, b) => countUnique(a) - countUnique(b));
      case "vowels-desc":
        return sortable.sort((a, b) => countVowels(b) - countVowels(a));
      case "consonants-desc":
        return sortable.sort((a, b) => countConsonants(b) - countConsonants(a));
      case "alpha-asc":
      default:
        return sortable.sort((a, b) => a.localeCompare(b));
    }
  }, [filteredWords, sortOrder]);

  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
    return sortedWords.slice(startIndex, startIndex + WORDS_PER_PAGE);
  }, [sortedWords, currentPage]);

  const totalPages = Math.ceil(sortedWords.length / WORDS_PER_PAGE);

  const resetAllFilters = () => setFilters(initialFilters);

  const handleGetRandomWord = () => {
    if (sortedWords.length == 0) return;
    const randomIndex = Math.floor(Math.random() * sortedWords.length);
    setRandomWord(sortedWords[randomIndex]);
  };

  const dismissRandomWord = () => {
    setRandomWord(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center items-center text-gray-600 dark:text-gray-300">
        <LoaderCircle className="w-12 h-12 animate-spin text-indigo-500" />
        <p className="mt-4 text-lg">Loading words...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex justify-center items-center text-red-500 dark:text-red-400">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 font-sans">
      <header className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center">
              <BookOpenText className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-indigo-600 dark:text-indigo-500" />
              Word Finder
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      <main>
        <FilterControls
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetAllFilters}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SortControls
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            filteredCount={filteredWords.length}
            totalCount={allWords.length}
            onGetRandomWord={handleGetRandomWord}
          />

          {/* Conditionally render random word */}
          {randomWord && (
            <RandomWordDisplay
              word={randomWord}
              onDismiss={dismissRandomWord}
            />
          )}

          <WordList words={paginatedWords} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
