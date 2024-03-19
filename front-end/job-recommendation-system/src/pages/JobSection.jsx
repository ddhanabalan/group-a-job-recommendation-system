import './JobSection.css'
import Filter from "../components/Filter";
import StatsAI from "../components/StatsAI";
import SearchBar from "../components/SearchBar";
import Jobs from "../components/Jobs";
export default function JobSection() {
    return (
        <div id="page">
            <Filter title="Filter jobs" />
            <StatsAI value="jobs"/>
            <div className="job-search">
            <SearchBar toSearch="Search Jobs" /> 
            </div>
            <Jobs/>
        </div>
    )
}