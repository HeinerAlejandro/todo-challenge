import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Chip } from "@mui/material";

export interface TagSelectOptions {
  value: string;
  label: string;
}

interface TagSelectFieldProps {
  options: TagSelectOptions[];
  selectedValues: string[];
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

const TagSelectField: React.FC<TagSelectFieldProps> = ({ options, onChange, selectedValues = [] }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="multi-select-label">Tags</InputLabel>
      <Select
        name="tags"
        labelId="multi-select-label"
        multiple
        value={selectedValues}
        onChange={onChange}
        renderValue={(selected) => (
          <div style={{  display: "flex", flexWrap: "wrap", gap: "5px", maxWidth:300, zIndex: 0 }}>
            {(selected as string[]).map((value) => (
              <Chip key={value} label={options.find((opt) => opt.value === value)?.label} />
            ))}
          </div>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={selectedValues.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagSelectField;