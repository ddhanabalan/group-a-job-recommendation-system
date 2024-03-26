import './JobSection.css'
import Filter from "../../components/Filter/Filter";
import StatsAI from "../../components/StatsAI/StatsAI";
import SearchBar from "../../components/SearchBar/SearchBar";
import Jobs from "../../components/Jobs/Jobs";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
export default function JobSection() {
    return (
        <div id="page">
            <Filter title="Filter jobs" />
            <NavigationBar active="job/candidate"/>
            <StatsAI value="jobs"/>
            <div className="job-search">
            <SearchBar toSearch="Search Jobs" /> 
            </div>
            <Jobs/>
        </div>
    )
}