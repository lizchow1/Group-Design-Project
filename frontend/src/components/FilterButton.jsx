import React, { useEffect, useRef } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const FilterButton = ({ toggleFilter, handleToggle, filterOpen, checked }) => {
    const filterRef = useRef(null);
    const tags = ["Italian", "Asian", "Indian", "Dessert", "Quick", "Gluten free", "AI-Generated"];
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                toggleFilter();
            }
        };

        if (filterOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterOpen, toggleFilter]);


    return (
        <div className="relative">
            <TuneOutlinedIcon
                onClick={toggleFilter}
                className="cursor-pointer"
                style={{ color: "#22c55e" }}
            />

            {filterOpen && (
                <div
                    ref={filterRef}
                    className="absolute bg-white shadow-lg p-2 rounded-md"
                    style={{ top: "40px", left: "0px", zIndex: 10 }}
                >
                    <List sx={{ width: '100%', maxWidth: 360 }}>
                        {tags.map((tag) => {
                            const labelId = `checkbox-list-label-${tag}`;
                            return (
                                <ListItem key={tag} disablePadding>
                                    <ListItemButton role={undefined} onClick={handleToggle(tag)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.includes(tag)}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                sx={{
                                                    color: "green",
                                                    "&.Mui-checked": {
                                                        color: "green",
                                                    },
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={tag} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            )}
        </div>
    );
};

export default FilterButton;
