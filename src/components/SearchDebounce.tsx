import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Portal from "./Portal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  onSearch: (
    query: string,
    event?: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onTyping?: (query: string) => void;
  suggestions: string[];
  placeHolder: string;
}

const SearchBarDebounce: React.FC<SearchBarProps> = ({
  onSearch,
  onTyping,
  suggestions,
  placeHolder,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);

  const inputRef = useRef<HTMLDivElement>(null);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = suggestions
        .filter((sug) => sug.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestion(-1);
    }
  }, [searchQuery, suggestions]);

  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      setInputRect(inputRef.current.getBoundingClientRect());
    }
  }, [showSuggestions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onTyping?.(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeSuggestion >= 0) {
        const selectedSuggestion = filteredSuggestions[activeSuggestion];
        setSearchQuery(selectedSuggestion);
        setShowSuggestions(false);
        onSearch(selectedSuggestion, e);
      } else {
        onSearch(searchQuery, e);
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <>
      <div className="relative w-full mx-auto" ref={inputRef}>
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-300 focus-within:border-blue-500 transition">
          <Search className="absolute left-4 text-gray-500 h-5 w-5" />
          <Input
            type="text"
            placeholder={placeHolder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-12 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-0"
          />
          <Button
            onClick={() => onSearch(searchQuery)}
            className="absolute right-4 text-gray-500 hover:text-gray-700"
            variant="ghost"
            size="icon"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && inputRect && (
        <Portal>
          <ul
            className="bg-slate-100 border border-gray-200 rounded-lg shadow-md max-h-52 overflow-y-auto z-[9999]"
            style={{
              top: inputRect.bottom + window.scrollY,
              left: inputRect.left + window.scrollX,
              width: inputRect.width,
              position: "absolute",
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  activeSuggestion === index ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </Portal>
      )}
    </>
  );
};

export default SearchBarDebounce;
