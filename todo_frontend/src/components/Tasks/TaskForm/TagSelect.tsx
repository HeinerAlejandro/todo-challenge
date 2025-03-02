import * as React from 'react';
import { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { getTags, createTag } from '../../../api/tags';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';

interface Tag {
  id: number;
  name: string;
}

interface TagSelectorProps {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      position: 'relative'
    },
  },
};

export default function MultipleSelectWithInput({ selectedTags, setSelectedTags }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    getTags()
      .then((res) => {
        const fetchedTags: Tag[] = Array.isArray(res) ? res : [];
        setTags(fetchedTags);
      })
      .catch((err) => {
        console.error("Error obteniendo tags:", err);
        setTags([]);
      });
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const {
      target: { value },
    } = event;
    const selectedValues = Array.isArray(value) ? value.filter((v) => typeof v === 'object' && v !== null) as Tag[] : [];
    setSelectedTags(selectedValues);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      const res = await createTag(newTag);
      const createdTag: Tag = res;
      
      setTags((prevTags) => [...prevTags, createdTag]);
      setSelectedTags([...selectedTags, createdTag]);
      setNewTag("");
    } catch (err) {
      console.error("Error creando tag:", err);
    }
  };

  return (
    <FormControl sx={{ mt: 2, width: "100%" }}>
      <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={selectedTags}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value.id} label={value.name} />
              ))}
            </Box>
          )}
        MenuProps={MenuProps}
        
      >
        {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag}>
            <Checkbox checked={selectedTags.some((t) => t.id === tag.id)} />
            <ListItemText primary={tag.name}/>
          </MenuItem>
        ))}
        <Box sx={{ position: 'sticky', bottom: 0, background: 'white', padding: '8px', boxShadow: '0px -2px 5px rgba(0,0,0,0.1)' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Agregar nuevo..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
        </Box>
      </Select>
    </FormControl>
  );
}
