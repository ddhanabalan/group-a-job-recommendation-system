import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
    return (

        <TextField
            id="search"
            type="search"
            placeholder="Search Jobs"
            value={searchTerm}
            onChange={handleChange}
            sx={{ width: 600, backgroundColor: 'white', mt: 5, position: 'absolute', top:0}}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />

    )
}