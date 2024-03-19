import './SearchBar.css';
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
export default function SearchBar({toSearch, searchHeight=50, searchColor="white"}) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
    return (

        <TextField
            id="search"
            className='search'
            type="search"
            placeholder={toSearch}
            value={searchTerm}
            onChange={handleChange}
            
            InputProps={{
                sx: { borderRadius: 30 ,height: searchHeight, backgroundColor: searchColor},
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />

    )
}