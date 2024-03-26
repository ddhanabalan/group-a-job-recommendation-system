import './Jobs.css';
import JobCard from '../JobCard/JobCard';
export default function Jobs() {
    const demoInfo = { jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: "50k", postDate: "13/9/23" };
    return (

        <div className="cards-container">
            <JobCard data={demoInfo} />
            <JobCard data={demoInfo} />
            <JobCard data={demoInfo} />
            <JobCard data={demoInfo} />
            <JobCard data={demoInfo} />
        </div>
    )
}