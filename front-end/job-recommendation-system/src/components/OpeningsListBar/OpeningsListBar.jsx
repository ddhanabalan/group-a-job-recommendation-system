import './OpeningsListBar.css';
import JobOpeningCard from '../JobOpeningCard/JobOpeningCard';
import SearchBar from "../SearchBar/SearchBar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BackBtn from '../BackBtn/BackBtn';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Button, Icon } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function HighlightableJobCard({id, highlighted, type, data, listToDescFunc, deleteJobFunc, onclick}){
    //console.log("highlighted ", id, " : ", highlighted)
    return(
    <div className="card-holder" onClick={()=>onclick(id)}>
        <JobOpeningCard data={data} type={type} listToDescFunc={listToDescFunc} deleteJobFunc={deleteJobFunc} highlighted={highlighted}/>
    </div>
    )
}

export default function OpeningsListBar({data, userType, userID, chooseEntry, searchBar, preselectedEntry, filterFunc, pageType, listToDescParentFunc=null, deleteJobFunc=null}) {
    
    //console.log("received jobs in data", data);
    const finalInfo = {...data}
    //console.log("opening bar data",data)
    //console.log("data passed to opening cards", finalInfo)
    const [highlightedId, setHighlightedId] = useState(preselectedEntry);
    
    //console.log("highlighted id=",preselectedEntry)
    const [searchVal, setSearch] = useState(null); //variable for storing earth star value
    const [filterStat, setFilter] = useState(false);
    const [sidebarDesc, setSideBar] = useState(false);
    //console.log("sidebarState", sidebarDesc);
    function listToDescFunc(){
        setSideBar(true);
    }
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

    useEffect(() => {
                    filterFunc(filterStat)
                    }, 
                    [filterStat])

    useEffect(() => {
        if(listToDescParentFunc && sidebarDesc===true)listToDescParentFunc();
        }, 
        [sidebarDesc])

    useEffect(() => {
            setHighlightedId(preselectedEntry)
            }, 
            [preselectedEntry])
    
    return (
        <>
        <div className="left-bar">
            <div className="openings-search-tile">
                <div className="search-bar">
                    <div className="back-icon">
                        <Link to="/profile">
                            <BackBtn/>
                        </Link>
                    </div>
                    <div className="opening-search">
                        <SearchBar toSearch={"Search jobs"} searchHeight={33} onSearch={onSearch} searchColor="#D9D9D9"/>
                    </div>
                    <div className="sort-icon">
                        <IconButton onClick={()=>setFilter(!filterStat)} sx={{ borderRadius: 50, backgroundColor: (filterStat?'black':'#E7E4E4'),width:35,height:35, "&.MuiButtonBase-root:hover": {bgcolor: (filterStat?'black':'#E7E4E4')},}}>
                            <SortIcon sx={{ color: (filterStat?'white':'black') }} />
                        </IconButton>
                    </div>
                </div>
                {userType=="employer"?
                    <div className="create-vacancy-button" >
                        <Link to="../employer/job-vacancy" state={{user_id: userID}}><Button variant="contained"  sx={{color: 'black', backgroundColor: '#D9D9D9',width: 'fit-content', paddingY: "4px", paddingX: "10px", textTransform: "none", borderRadius: 20}} endIcon={<Icon sx={{backgroundColor: "white", borderRadius: 50, width: "23px", height: "23px", display: "flex", alignSelf: "centre"}}><AddIcon sx={{color:"black"}}/></Icon>}>
                        <p>Create Job Vacancy</p>
                        </Button></Link>
                    </div>
                    :
                    <></>
                }
            </div>
            
            <div className="openings-container">
                {Object.keys(finalInfo).map((card) => (<HighlightableJobCard key={finalInfo[card]["id"]} id={finalInfo[card]["id"]} onclick={highlightDiv} highlighted={highlightedId == finalInfo[card]["id"]} type={userType=="employer"?pageType:null} deleteJobFunc={deleteJobFunc} listToDescFunc={listToDescFunc} data={{...finalInfo[card],'userType':userType, 'highlightedId': highlightedId}} />))}   
            </div>
            
        </div>
        </>
    )
}