import './Jobs.css';
import { useState, useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import JobCardExpanded from '../JobCardExpanded/JobCardExpanded';
import AiJobs from '../../components/AiJobs/AiJobs';
import { v4 as uuid } from 'uuid';


export default function Jobs({ userData, data, modelData,dataType=null, dataToParentFn = null, createJobRequest = null, handleInvite=null, desc_state = null, }) {

    const finalInfo = [...data];
    console.log("final information to job card", finalInfo)
    //const userType="none";
    //console.log("data to card", finalInfo)
    //const parentDescState=desc_state?desc_state:false;
    const [descriptionOn, setDesc] = useState(desc_state ? desc_state : false);
    const [selectedId, setId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    //console.log("final data info" ,finalInfo);
    function openDesc(id) {
        console.log("selected id", id);
        setDesc(true);
        setId(id);
        const selection = finalInfo.filter(e => (e.id == id ? e : false))[0]
        //console.log("selection", selection)
        setSelectedJob(selection)


    }
    //console.log("description status job component",descriptionOn);

    useEffect(() => {
        if (dataToParentFn) dataToParentFn(descriptionOn)
    }, [descriptionOn])
    useEffect(() => {
        if (desc_state !== null) setDesc(desc_state);
        //console.log("changed");
    }, [desc_state]);
    useEffect(() => {
        if (selectedId != null) setSelectedJob(finalInfo.filter(e => (e.id == selectedId ? e : false))[0]);
    }, [finalInfo])
    const demoInfo = [{ id: 0, jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["python", "AI", "Django"] },
    { id: 1, jobTitle: "Java Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'Moscow', empType: 'Internship', exp: '1-5 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["java", "AI"] },
    { id: 2, jobTitle: "Ruby Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'Uganda', empType: 'Temporary', exp: 'Fresher', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["ruby", "AI", "Django"] },
    { id: 3, jobTitle: "Golang Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'Alaska', empType: 'Internship', exp: '5-10 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["python", "AI", "Django"] },
    { id: 4, jobTitle: "Game Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'Germany', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["react", "AI", "Django"] },
    { id: 5, jobTitle: "Python Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["python", "AI", "Django"] },
    { id: 6, jobTitle: "Java Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'Alaska', empType: 'Temporary', exp: 'Fresher', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["reactor", "AI", "Django"] },
    { id: 7, jobTitle: "Ruby Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["python", "AI", "Django"] },
    { id: 8, jobTitle: "Golang Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'India', empType: 'Internship', exp: '1-5 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["python", "AI", "Django"] },
    { id: 9, jobTitle: "Game Developer", companyName: "Google LLC", tags: ["on-site", "software / IT", "Monday-Friday"], currency: "₹", salary: ["5000", "10000"], postDate: "13/9/23", location: 'London', empType: 'Full-time', exp: '5-10 years', jobDesc: "This is for demo purpose", jobReq: "This is for demo purpose", skills: ["python", "AI", "Django"] },]

    return (
        <div className="cards-container">

            {descriptionOn ?
                <JobCardExpanded data={selectedJob} createJobRequest={createJobRequest} handleInvite={handleInvite} userData={userData} invite={selectedJob.invite_status?true:null}/>
                : (
                    <>  
                        {console.log("lenghds ", modelData.length)}
                        {dataType !== "approval"&& <AiJobs childData={modelData} expandView={openDesc} />}
                        {
                            Object.keys(finalInfo).map((card) => (<JobCard key={uuid()} id={finalInfo[card]["id"]} expandView={openDesc} data={{ ...finalInfo[card], 'userType': "seeker" }} />))
                        }
                    </>
                )
            }
        </div>
    )
}