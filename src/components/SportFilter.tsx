import { memo } from "react";

interface SportFilterProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SportFilter({ value, options, onChange }: SportFilterProps) {
  return (
    <label className="control-group" htmlFor="sport-filter">
      <span>Filter by sport</span>
      <select
        id="sport-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>
    </label>
  );
}

export default memo(SportFilter);
