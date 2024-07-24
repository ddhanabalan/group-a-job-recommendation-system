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


function HighlightableJobCard({ id, highlighted, type, data, listToDescFunc, deleteJobFunc,editJobVacancyStatusFunc, onclick, invite, inviteJob, seekerJobs, applicationType }) {
    //console.log("highlighted ", id, " : ", highlighted)
    console.log("id", id, highlighted)
    const [disabled, setDisabled] = useState(false);

    const disableCard =(status)=>{
        setDisabled(status);
    }
    let inviteData=null;
    if(inviteJob)inviteData={"type":inviteJob.type,"status": (inviteJob.type=="invite"?inviteJob.invite_status:inviteJob.job_status), "id": (inviteJob.type=="invite"?inviteJob.job_invite_id:inviteJob.job_request_id)}
    console.log("data pass", data, inviteJob)
    return (
        <div className="card-holder" onClick={!disabled?() => {inviteData?onclick(id,inviteData.type, inviteData.status, inviteData.id):(seekerJobs===true?onclick(id, applicationType):onclick(id))}: ()=>{}}>
            <JobOpeningCard disabled={disableCard} data={data} type={type} listToDescFunc={listToDescFunc} deleteJobFunc={deleteJobFunc} editJobVacancyStatusFunc={editJobVacancyStatusFunc} highlighted={highlighted} invite={invite} inviteJob={inviteJob} />
        </div>
    )
}

export default function OpeningsListBar({ data, userType, userID, chooseEntry, searchBar, preselectedEntry=null, preselectedEntryType=null, filterFunc = null, pageType, handleApplicationStatus = null, userJobs = null, listToDescParentFunc = null, deleteJobFunc = null,editJobVacancyStatusFunc=null, invite=null, seekerJobs = false }) {
    console.log("user received jobs", userJobs, seekerJobs)
    
    console.log("received jobs to openings list bar", data);
    const [initInfo,setInitInfo] = useState(data)
    const [finalInfo,setFinalInfo] = useState(data) 
    const [applicationFilter, setApplicationFilter] = useState({"Applied": false, "Invited": false, "Rejected": false, "Approved": false})

    //console.log("opening bar data",data)
    
    const [highlightedId, setHighlightedId] = useState(preselectedEntry);
    const [highlightedEntryType, setHighlightedEntryType] = useState(preselectedEntryType)
    const [applicationTypeData, setApplicationTypeData] = useState({});

    console.log("highlighted id=",preselectedEntry, highlightedId)
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

    function handleSeekerJobSection(card_info){
        const r = seekerJobs?(card_info.type=="request"?card_info["job_req_id"]:card_info["job_invite_id"]):card_info["id"];
        console.log("logged", seekerJobs, r, card_info)
        return r;
    }
    function handleApplicationFilter(entry){
        //function for passing selected job opening card from child component to parent componenet
        setApplicationFilter(entry);
    }

    function statusFilter(){
        const activeFilters = Object.keys(applicationFilter).filter(key => applicationFilter[key]).map(f=>f.toLowerCase());
        console.log("activ filters", applicationFilter, activeFilters)
        if(activeFilters.length)
        {const filterResponse = initInfo.filter(e=>{if(e.type === "invite" && activeFilters.includes("invited")){return e}
                                else if( e.type ==="request" && activeFilters.includes(e.status.toLowerCase())){return e}
                                else return null;})
          console.log("filtered applications list ", data,filterResponse, activeFilters)

          setFinalInfo(filterResponse);
        }
        else{
            setFinalInfo(initInfo);
        }
        
        
      }

    function highlightDiv(id, application_type = null, application_status = null, application_id=null) {
        //function for highlighting selected opening cards
        //console.log("highlighting id", id)
        setHighlightedId(id);
        console.log("application da", application_status, application_type)
        if(application_type && seekerJobs){
            setHighlightedEntryType(application_type);
        }
        else if(application_type && application_id){
            setApplicationTypeData({"application_type": application_type, "application_status": application_status, "application_id": application_id})
        }

    }

    useEffect(() => {
        if(seekerJobs===false)
        {if (highlightedId != null) {
            chooseEntry(highlightedId)
        }}
        else{
            console.log("highlighted id", highlightedId, highlightedEntryType)
            if (highlightedId != null && highlightedEntryType != null) {
                chooseEntry(highlightedId, highlightedEntryType)
                console.log("highlighted")
            } 
        }
        if (searchVal != null) {
            searchBar(searchVal)
        }
    },
        [highlightedId, searchVal])

    useEffect(() => {
        if(filterFunc)filterFunc(filterStat);
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
        setHighlightedEntryType(preselectedEntryType)
        console.log("preselected entry type set", preselectedEntryType)
    },
        [preselectedEntryType])
    useEffect(() => {
        if(handleApplicationStatus && Object.keys(applicationTypeData).length)handleApplicationStatus(applicationTypeData);
    }, [applicationTypeData])
    useEffect(() => {
        if(seekerJobs)statusFilter();
        else(setFinalInfo(initInfo))
    }, [applicationFilter, initInfo])
    useEffect(()=>{
        setInitInfo(data);
    }, [data])

    return (
        <>
            <div className="left-bar">
                <div className="openings-search-tile">
                    <div className="search-bar">
                        {pageType !== "candidates" &&
                        <div className="back-icon-opening">
                            <Link to="/profile">
                                <BackBtn />
                            </Link>
                        </div>
                        }
                        <div className="opening-search">
                            <SearchBar toSearch={"Search jobs"} searchHeight={33} onSearch={onSearch} searchColor="#D9D9D9" />
                        </div>
                        {filterFunc &&
                        <div className="sort-icon">
                            <IconButton onClick={() => setFilter(!filterStat)} sx={{ borderRadius: 50, backgroundColor: (filterStat ? 'black' : '#E7E4E4'), width: 35, height: 35, "&.MuiButtonBase-root:hover": { bgcolor: (filterStat ? 'black' : '#E7E4E4') }, }}>
                                <SortIcon sx={{ color: (filterStat ? 'white' : 'black') }} />
                            </IconButton>
                        </div>}
                    </div>
                    {userType == "employer" && pageType!=="candidates" &&
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
                {seekerJobs?
                <div className="user-application-filter">
                    {Object.keys(applicationFilter).map(e=>
                    <button className={`user-application-filter-btn application-filter-btn application-filter-btn-apply application-filter-btn${applicationFilter[e]?`-active-${e.toLowerCase()}`: ""} application-filter-btn${"-" + e.toLowerCase()}`} onClick={()=>{handleApplicationFilter({...applicationFilter, [e]: !applicationFilter[e]})}}> 
                    {e}
                    </button>)
                    }  
                </div>
                :
                <></>
                }
                <div className="openings-container">
                    {finalInfo.length!=0?
                        (
                        //console.log("finalInfo check", finalInfo)
                        //Object.keys(finalInfo).map((card) => console.log("this is what i received", card, finalInfo[card]))
                         finalInfo.map((card) => (<HighlightableJobCard key= {finalInfo.indexOf(card)} id={handleSeekerJobSection(card)} onclick={highlightDiv} highlighted={highlightedId == handleSeekerJobSection(card) && (seekerJobs?(card.type===highlightedEntryType): true)} type={userType == "employer" && pageType!=="candidates" ? pageType : null} applicationType={seekerJobs?card.type: null} inviteJob={userJobs && userJobs.length?userJobs.filter(job => {if(job.job_vacancy_id == card["id"] )return job}): null} deleteJobFunc={deleteJobFunc} editJobVacancyStatusFunc={editJobVacancyStatusFunc} listToDescFunc={listToDescFunc} data={{ ...card, 'userType': userType, 'highlightedId': highlightedId }} invite={invite} seekerJobs={seekerJobs?true: false}/>))
                        )
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