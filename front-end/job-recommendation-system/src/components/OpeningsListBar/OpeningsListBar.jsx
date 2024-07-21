import './OpeningsListBar.css';
import JobOpeningCard from '../JobOpeningCard/JobOpeningCard';
import SearchBar from "../SearchBar/SearchBar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BackBtn from '../BackBtn/BackBtn';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { IconButton, Button, Icon } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function HighlightableJobCard({ id, highlighted, type, data, listToDescFunc, deleteJobFunc, onclick, invite, inviteJob }) {
    //console.log("highlighted ", id, " : ", highlighted)
    const [disabled, setDisabled] = useState(false);
    const disableCard =(status)=>{
        setDisabled(status);
    }
    let inviteData=null;
    if(inviteJob)inviteData={"type":inviteJob.type,"status": (inviteJob.type=="invite"?inviteJob.invite_status:inviteJob.job_status), "id": (inviteJob.type=="invite"?inviteJob.job_invite_id:inviteJob.job_request_id)}
    console.log("data pass", data, inviteJob)
    return (
        <div className="card-holder" onClick={!disabled?() => {inviteData?onclick(id,inviteData.type, inviteData.status, inviteData.id):onclick(id)}: ()=>{}}>
            <JobOpeningCard disabled={disableCard} data={data} type={type} listToDescFunc={listToDescFunc} deleteJobFunc={deleteJobFunc} highlighted={highlighted} invite={invite} inviteJob={inviteJob} />
        </div>
    )
}

export default function OpeningsListBar({ data, userType, userID, chooseEntry, searchBar, preselectedEntry, filterFunc, pageType, handleApplicationStatus = null, userJobs = null, listToDescParentFunc = null, deleteJobFunc = null, invite=null }) {
    console.log("user received jobs", userJobs)
    
    console.log("received jobs to openings list bar", data);
    const finalInfo = { ...data }
    //console.log("opening bar data",data)
    //console.log("data passed to opening cards", finalInfo)
    const [highlightedId, setHighlightedId] = useState(preselectedEntry);
    const [applicationTypeData, setApplicationTypeData] = useState({});

    //console.log("highlighted id=",preselectedEntry)
    const [searchVal, setSearch] = useState(null); //variable for storing earth star value
    const [filterStat, setFilter] = useState(false);
    const [sidebarDesc, setSideBar] = useState(false);
    //console.log("sidebarState", sidebarDesc);
    function listToDescFunc() {
        setSideBar(true);
    }
    function onSearch(searchValue) {
        //function for updating searchvalue from searchbox
        setSearch(searchValue);
    }

    function highlightDiv(id, application_type = null, application_status = null, application_id=null) {
        //function for highlighting selected opening cards
        //console.log("highlighting id", id)
        setHighlightedId(id);
        console.log("application da", application_status, application_type)
        if(application_type){
            setApplicationTypeData({"application_type": application_type, "application_status": application_status, "application_id": application_id})
        }

    }

    useEffect(() => {
        if (highlightedId != null) {
            chooseEntry(highlightedId)
        }
        if (searchVal != null) {
            searchBar(searchVal)
        }
    },
        [highlightedId, searchVal])

    useEffect(() => {
        filterFunc(filterStat)
    },
        [filterStat])

    useEffect(() => {
        if (listToDescParentFunc && sidebarDesc === true) listToDescParentFunc();
    },
        [sidebarDesc])

    useEffect(() => {
        setHighlightedId(preselectedEntry)
    },
        [preselectedEntry])
    useEffect(() => {
        if(handleApplicationStatus && Object.keys(applicationTypeData).length)handleApplicationStatus(applicationTypeData);
    }, [applicationTypeData])

    return (
        <>
            <div className="left-bar">
                <div className="openings-search-tile">
                    <div className="search-bar">
                        <div className="back-icon-opening">
                            <Link to="/profile">
                                <BackBtn />
                            </Link>
                        </div>
                        <div className="opening-search">
                            <SearchBar toSearch={"Search jobs"} searchHeight={33} onSearch={onSearch} searchColor="#D9D9D9" />
                        </div>
                        <div className="sort-icon">
                            <IconButton onClick={() => setFilter(!filterStat)} sx={{ borderRadius: 50, backgroundColor: (filterStat ? 'black' : '#E7E4E4'), width: 35, height: 35, "&.MuiButtonBase-root:hover": { bgcolor: (filterStat ? 'black' : '#E7E4E4') }, }}>
                                <SortIcon sx={{ color: (filterStat ? 'white' : 'black') }} />
                            </IconButton>
                        </div>
                    </div>
                    {userType == "employer" &&
                        <div className="create-vacancy-button" >
                            <Link to="../employer/job-vacancy" state={{ user_id: userID }}>
                                <Button
                                    disableElevation className='create-vacancy-mui-btn'
                                    variant="contained" sx={{ color: 'black', backgroundColor: '#D9D9D9', width: 'fit-content', paddingY: "4px", paddingX: "10px", textTransform: "none", borderRadius: 20 }}
                                    endIcon={<AddCircleOutlineRoundedIcon sx={{ color: "black" }} />}>
                                    <p style={{ fontSize: '.8rem' }}>Create job vacancy</p>
                                </Button></Link>
                        </div>
                    }
                </div>

                <div className="openings-container">
                    {Object.keys(finalInfo).length!=0?
                        Object.keys(finalInfo).map((card) => (<HighlightableJobCard key={finalInfo[card]["id"]} id={finalInfo[card]["id"]} onclick={highlightDiv} highlighted={highlightedId == finalInfo[card]["id"]} type={userType == "employer" ? pageType : null} inviteJob={userJobs && userJobs.length?userJobs.filter(job => {if(job.job_vacancy_id == finalInfo[card]["id"])return job})[0]: null} deleteJobFunc={deleteJobFunc} listToDescFunc={listToDescFunc} data={{ ...finalInfo[card], 'userType': userType, 'highlightedId': highlightedId }} invite={invite} />))
                        :
                        (userType=="employer"?
                        <div className="empty-container-message">
                            <p>You haven't created any vacancies yet.</p>
                            <p>Start by clicking 'Create job vacancy' button.</p>
                        </div>
                        :
                        <div className="empty-container-message">
                            <p>You haven't applied for any jobs yet.</p> 
                        </div>
                        )

                    }
                </div>

            </div>
        </>
    )
}