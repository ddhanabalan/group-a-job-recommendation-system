import './OpeningsListBar.css';
import JobOpeningCard from './JobOpeningCard';
import SearchBar from "../components/SearchBar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Button, Icon } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function HighlightableJobCard({id, highlighted, data, onclick}){
    return(
    <div className="card-holder" onClick={()=>onclick(id)}>
        <JobOpeningCard data={data} highlighted={highlighted}/>
    </div>
    )
}

export default function OpeningsListBar({data, userType, chooseEntry}) {
    
    const finalInfo = {...data}
    
    const [highlightedId, setHighlightedId] = useState(0);
    const [searchVal, setSearch] = useState(null); //variable for storing earth star value
    
    
    function onSearch(searchValue){
        //function for updating searchvalue from searchbox
        setSearch(searchValue);
    }
    
    function highlightDiv(id){
        //function for highlighting selected opening cards
        setHighlightedId(id);
        
    }
    
    useEffect(() => {
                    if(highlightedId!=null)
                    {
                    chooseEntry(highlightedId)
                    }
                    }, 
                    [highlightedId])
    
    
    return (
        <>
        <div className="left-bar">
            <div className="openings-search-tile">
                <div className="search-bar">
                    <div className="back-icon">
                        <IconButton aria-label="back" sx={{display: "flex", alignItems: "center", width: 35, height: 35}}>
                            <ArrowBackIosIcon sx={{color: "black"}}/>
                        </IconButton>
                    </div>
                    <div className="opening-search">
                        <SearchBar searchHeight={33} onSearch={onSearch} searchColor="#D9D9D9"/>
                    </div>
                    <div className="sort-icon">
                        <IconButton sx={{ borderRadius: 50, backgroundColor: '#E7E4E4',width:35,height:35}}>
                            <SortIcon sx={{ color: 'black' }} />
                        </IconButton>
                    </div>
                </div>
                {userType=="employer"?
                    <div className="create-vacancy-button" >
                        <Link to="../employer/job-vacancy"><Button variant="contained"  sx={{color: 'black', backgroundColor: '#D9D9D9',width: 'fit-content', paddingY: "4px", paddingX: "10px", textTransform: "none", borderRadius: 20}} endIcon={<Icon sx={{backgroundColor: "white", borderRadius: 50, width: "23px", height: "23px", display: "flex", alignSelf: "centre"}}><AddIcon sx={{color:"black"}}/></Icon>}>
                        <p>Create Job Vacancy</p>
                        </Button></Link>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className="openings-container">
                {Object.keys(finalInfo).map((id) => (<HighlightableJobCard key={id} id={id} onclick={highlightDiv} highlighted={highlightedId == id} data={{...finalInfo[id],'userType':userType}} />))}
            </div>
        </div>
        </>
    )
}