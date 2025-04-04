import React, { useEffect, useRef } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // MUI icon for sorting

const SortButton = ({ toggleSort, handleSortSelect, sortOpen, currentSort }) => {
    const sortRef = useRef(null);
    const options = [
        { label: "Name ↑", value: "name-asc" },
        { label: "Name ↓", value: "name-desc" },
        { label: "Cooking Time ↑", value: "cooking_time-asc" },
        { label: "Cooking Time ↓", value: "cooking_time-desc" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                toggleSort();
            }
        };

        if (sortOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sortOpen, toggleSort]);

    return (
        <div className="relative">
            <ArrowDownwardIcon
                onClick={toggleSort}
                className="cursor-pointer"
                style={{ color: "#22c55e" }}
            />

            {sortOpen && (
                <div
                    ref={sortRef}
                    className="absolute bg-white shadow-lg p-2 rounded-md"
                    style={{ top: "40px", left: "0px", zIndex: 10 }}
                >
                    <List sx={{ width: '100%', maxWidth: 300 }}>
                        {options.map(({ label, value }) => (
                            <ListItem key={value} disablePadding>
                                <ListItemButton
                                    onClick={() => handleSortSelect(value)}
                                    selected={value === currentSort}
                                >
                                    <ListItemText primary={label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
};

export default SortButton;
