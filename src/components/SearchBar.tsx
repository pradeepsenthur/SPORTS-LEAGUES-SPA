import { memo, useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(draft);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [draft, onChange]);

  return (
    <label className="control-group" htmlFor="league-search">
      <span>Search league name</span>
      <input
        id="league-search"
        type="search"
        placeholder="Type league name..."
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
    </label>
  );
}

export default memo(SearchBar);
