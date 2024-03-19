import './OpeningsListBar.css';
import JobOpeningCard from './JobOpeningCard';
import SearchBar from "../components/SearchBar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Button, Icon } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

export default function OpeningsListBar({data}) {
    const demoInfo = { jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: "50k", postDate: "13/9/23" };
    const finalInfo = {...demoInfo, ...data}
    console.log({finalInfo})
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
                        <SearchBar searchHeight={33} searchColor="#D9D9D9"/>
                    </div>
                    <div className="sort-icon">
                        <IconButton sx={{ borderRadius: 50, backgroundColor: '#E7E4E4',width:35,height:35}}>
                            <SortIcon sx={{ color: 'black' }} />
                        </IconButton>
                    </div>
                </div>
                {data.usertype=="employer"?
                    <div className="create-vacancy-button">
                        <Button variant="contained" sx={{color: 'black', backgroundColor: '#D9D9D9',width: 'fit-content', paddingY: "4px", paddingX: "10px", textTransform: "none", borderRadius: 20}} endIcon={<Icon sx={{backgroundColor: "white", borderRadius: 50, width: "23px", height: "23px", display: "flex", alignSelf: "centre"}}><AddIcon sx={{color:"black"}}/></Icon>}>
                        <p>Create Job Vacancy</p>
                        </Button>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className="openings-container">
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
                <JobOpeningCard data={finalInfo} />
            </div>
        </div>
        </>
    )
}