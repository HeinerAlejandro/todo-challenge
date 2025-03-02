import React, { useContext, useState } from "react";
import { TextField, Button, Box, Checkbox, FormControlLabel } from "@mui/material";
import { TaskContext } from "../../../context/Task";
import { TagContext } from "../../../context/Tags";
import TagSelectField, { TagSelectOptions } from "./TagSelectField";
import { Tag } from "../../../models/tag.model";

interface FiltersForm {
    title?: string;
    description?: string;
    tags: string[];
    created_at?: string;
    finish_at?: string;
    completed?: boolean;
}

const DEFAULT_FORM_DATA: FiltersForm = {
    title: "",
    description: "",
    created_at: "",
    finish_at: "",
    tags: [],
    completed: undefined,
};

const TaskFilters: React.FC = () => {
    const tagContext = useContext(TagContext)!;
    const taskContext = useContext(TaskContext)!;
    const [filtersForm, setFiltersForm] = useState<FiltersForm>(DEFAULT_FORM_DATA);

    if (!tagContext || !taskContext) {
        return <p>Cargando...</p>;
    }

    const { tags } = tagContext;
    const { stablishFilters } = taskContext;

    const handleFilterChange = () => {
        stablishFilters({
            "title__icontains": filtersForm.title,
            "description__icontains": filtersForm.description,
            "created_at__gte": filtersForm.created_at,
            "finish_at__lte": filtersForm.finish_at,
            "tags": filtersForm.tags,
            "completed": filtersForm.completed
        });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFiltersForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onTagsChange = (selectedTags: string[]) => {
        setFiltersForm(prev => ({
            ...prev,
            tags: selectedTags
        }));
    };

    const onCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiltersForm(prev => ({
            ...prev,
            completed: e.target.checked
        }));
    };

    const getTagsOptions = (): TagSelectOptions[] => {
        return tags.map((t: Tag) => ({
            label: t.name,
            value: String(t.id)
        }));
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} p={2} border={1} borderRadius={2} boxShadow={2}>
            <TextField
                name="title"
                label="Buscar por título"
                variant="outlined"
                value={filtersForm.title}
                onChange={onChange}
                fullWidth
            />
            <TextField
                name="description"
                label="Buscar por contenido"
                variant="outlined"
                value={filtersForm.description}
                onChange={onChange}
                fullWidth
            />

            <Box display="flex" alignItems="center" gap={2}>
                <TagSelectField 
                    options={getTagsOptions()}
                    onChange={(e) => onTagsChange(e.target.value as string[])}
                    selectedValues={filtersForm.tags}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filtersForm.completed || false}
                            onChange={onCompletedChange}
                            color="primary"
                        />
                    }
                    label="Completadas"
                />
            </Box>

            <Box display="flex" gap={2}>
                <TextField
                    name="created_at"
                    type="date"
                    label="Fecha inicio"
                    onChange={onChange}
                    InputLabelProps={{ shrink: true }}
                    value={filtersForm.created_at}
                    fullWidth
                />
                <TextField
                    name="finish_at"
                    type="date"
                    label="Fecha fin"
                    onChange={onChange}
                    InputLabelProps={{ shrink: true }}
                    value={filtersForm.finish_at}
                    fullWidth
                />
            </Box>
            <Button variant="contained" color="primary" onClick={handleFilterChange}>
                Aplicar filtros
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    setFiltersForm(DEFAULT_FORM_DATA);
                    stablishFilters({
                        "title__icontains": DEFAULT_FORM_DATA.title,
                        "description__icontains": DEFAULT_FORM_DATA.description,
                        "created_at__gte": DEFAULT_FORM_DATA.created_at,
                        "finish_at__lte": DEFAULT_FORM_DATA.finish_at,
                        "tags": DEFAULT_FORM_DATA.tags,
                        "completed": DEFAULT_FORM_DATA.completed,
                    });
                }}
            >
                Reestablecer Filtros
            </Button>
        </Box>
    );
};

export default TaskFilters;
