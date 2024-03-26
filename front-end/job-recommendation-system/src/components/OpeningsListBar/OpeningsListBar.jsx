import './OpeningsListBar.css';
import JobOpeningCard from '../JobOpeningCard/JobOpeningCard';
import SearchBar from "../SearchBar/SearchBar";
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

export default function OpeningsListBar({data, userType, chooseEntry, searchBar, preselectedEntry}) {
    
    const finalInfo = {...data}
    //console.log("opening bar data",data)
    //console.log("data passed to opening cards", finalInfo)
    const [highlightedId, setHighlightedId] = useState(preselectedEntry);
    //console.log("highlighted id=",highlightedId)
    const [searchVal, setSearch] = useState(null); //variable for storing earth star value
    
    
    function onSearch(searchValue){
        //function for updating searchvalue from searchbox
        setSearch(searchValue);
    }
    
    function highlightDiv(id){
        //function for highlighting selected opening cards
        //console.log("highlighting id", id)
        setHighlightedId(id);
        
    }
    
    useEffect(() => {
                    if(highlightedId!=null)
                    {
                    chooseEntry(highlightedId)
                    }
                    if(searchVal!=null)
                    {
                     searchBar(searchVal)
                    }
                    }, 
                    [highlightedId, searchVal])
    
    
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
                        <SearchBar toSearch={"Search jobs with tags"} searchHeight={33} onSearch={onSearch} searchColor="#D9D9D9"/>
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
                {Object.keys(finalInfo).map((card) => (<HighlightableJobCard key={finalInfo[card]["id"]} id={finalInfo[card]["id"]} onclick={highlightDiv} highlighted={highlightedId == finalInfo[card]["id"]} data={{...finalInfo[card],'userType':userType, 'highlightedId': highlightedId}} />))}
            </div>
        </div>
        </>
    )
}