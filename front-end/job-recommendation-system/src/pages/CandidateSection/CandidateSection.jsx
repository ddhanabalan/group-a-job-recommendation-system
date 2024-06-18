import Filter from "../../components/Filter/Filter";
import StatsAI from "../../components/StatsAI/StatsAI";
import SearchBar from "../../components/SearchBar/SearchBar";
import Candidates from "../../components/Candidates/Candidates";
import './CandidateSection.css';
export default function CandidateSection() {
    return (
        <div id="page">
            <div className="job-filter">
                <Filter title="Filter Applicants"/>
            </div>
            <StatsAI value="candidates"/>
            <div className="candidate-search">
                <SearchBar toSearch="Search candidates" />
            </div>
            <Candidates/>
        </div>
        
    )
}