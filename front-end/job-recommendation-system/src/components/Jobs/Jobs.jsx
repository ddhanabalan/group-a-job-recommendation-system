import './Jobs.css';
import { useState, useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import JobCardExpanded from '../JobCardExpanded/JobCardExpanded';
import AiJobs from '../../components/AiJobs/AiJobs';
import { v4 as uuid } from 'uuid';
import { indexOf } from 'lodash';


export default function Jobs({ userData, data=[], modelData=[],dataType=null, dataToParentFn = null, createJobRequest = null, handleInvite=null, desc_state = null, processing=null, setAiJobs=null}) {

    // const randomJobs = [...data.map(e=>({...e, 'element-index': data.indexOf(e)}))].filter(Boolean)
    // const aiJobs = [...modelData.map(e=>({...e, 'element-index': modelData.indexOf(e)}))].filter(Boolean)
    const randomJobs = [...data]
    const aiJobs = [...modelData]
    const finalInfo = [...randomJobs, ...aiJobs];
    
    console.log("final information to job card", finalInfo)
    //const userType="none";
    //console.log("data to card", finalInfo)
    //const parentDescState=desc_state?desc_state:false;
    const [descriptionOn, setDesc] = useState(desc_state ? desc_state : false);
    const [selectedId, setId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [focusElement, setFocusElement] = useState(null);
    //console.log("final data info" ,finalInfo);
    function openDesc(id) {
        console.log("selected id", id);
        setDesc(true);
        setId(id);
        const selection = finalInfo.filter(e => (e.id == id ? e : false))[0]
        //console.log("selection", selection)
        setSelectedJob(selection)


    }

    const chooseElementId=(id)=>{
        console.log("scroll log, saving", id)
        setFocusElement(id);
    }
    
    const scrollToItem = (id) => {
        const element = document.getElementById(id) || document.getElementById(`${id}`);
        console.log("scroll log, element", element)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

    const scrollToStart = ()=>{
        window.scrollTo({top:100}
        )
    }

    const loadingDelay = (delay, callFn, value=null) =>{
        setTimeout(() => {
            value?callFn(value):callFn();
        }, delay);
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
        if(finalInfo && finalInfo.length && focusElement && descriptionOn===false){
            console.log("scroll log , scrolling to",focusElement)
            loadingDelay(200,scrollToItem,focusElement);}
    }, [finalInfo])
    useEffect(() => {
        if(aiJobs)scrollToStart();
    }, [aiJobs])

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
                <JobCardExpanded data={selectedJob} createJobRequest={createJobRequest} handleInvite={handleInvite} userData={userData} invite={selectedJob.invite_status?true:null} processing={processing}/>
                : (
                    <>  
                        {console.log("lenghds ", modelData.length)}
                        {(dataType !== "approval"&& aiJobs.length) ?<AiJobs childData={aiJobs} expandView={openDesc} setAiJobs={setAiJobs} chooseSelectedId={chooseElementId} />: <></>}
                        {
                            randomJobs.map((job) => (<JobCard key={uuid()} id={`random-job-${job.id}`} expandView={openDesc} data={{ ...job, 'userType': "seeker" }} chooseSelectedId={chooseElementId} />))
                        }
                    </>
                )
            }
        </div>
    )
}