import React, { useEffect, useRef } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; 

const SortButton = ({ toggleSort, handleSortSelect, sortOpen, currentSort }) => {
    const sortRef = useRef(null);
    const options = [
        { label: "Sort By Name (Ascending)", value: "name-asc" },
        { label: "Sort By Name (Descending)", value: "name-desc" },
        { label: "Sort By Cooking Time (Ascending)", value: "time-asc" },
        { label: "Sort By Cooking Time (Descending)", value: "time-desc" }
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
                    style={{ top: "40px", left: "0px", zIndex: 10, width: '350px' }}
                >
                    <List sx={{ maxWidth: 350 }}>
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
