import Filter from "../components/Filter";
import StatsAI from "../components/StatsAI";
import SearchBar from "../components/SearchBar";
import Candidates from "../components/Candidates";
import './CandidateSection.css';
export default function CandidateSection() {
    return (
        <div id="page">
            <Filter title="Filter applicants"/>
            <StatsAI value="candidates"/>
            <SearchBar toSearch="Search candidates" />
            <Candidates/>
        </div>
        
    )
}