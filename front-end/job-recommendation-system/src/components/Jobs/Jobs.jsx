import './Jobs.css';
import { useState, useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import JobDesciptionForm from '../JobDescription/JobDesciption';


function ClickableJobCard({id, data, onclick})
{
    return(
        <div className='clickable-job-card' onClick={()=>{onclick(id)}}>
            <JobCard data={data}/>
        </div>
    )
}
export default function Jobs({data, dataToParentFn=null, createJobRequest=null, desc_state=null, userData}) {
    
    const finalInfo=[...data];
    //console.log("final information to job card", finalInfo)
    //const userType="none";
    console.log("data to card", finalInfo)
    //const parentDescState=desc_state?desc_state:false;
    const [descriptionOn, setDesc] = useState(desc_state?desc_state:false);
    const [selectedId, setId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    //console.log("final data info" ,finalInfo);
    function openDesc(id){
        //console.log("selected id", id);
        setDesc(true);
        setId(id);
        const selection = finalInfo.filter(e=>(e.id==id?e:false))[0]
        //console.log("selection", selection)
        setSelectedJob(selection)
        
        
    }
    //console.log("description status job component",descriptionOn);

    useEffect(()=>{
        if(dataToParentFn)dataToParentFn(descriptionOn)
        },[descriptionOn])
    useEffect(() => {
        if (desc_state !== null) setDesc(desc_state);
        //console.log("changed");
        }, [desc_state]);
    useEffect(() => {
        if(selectedId !=null)setSelectedJob(finalInfo.filter(e=>(e.id==selectedId?e:false))[0]);
    }, [finalInfo])

    return (

        <div className="cards-container">
            {descriptionOn?
            <JobDesciptionForm data={selectedJob} createJobRequest={createJobRequest} userData={userData}/>
            :
            Object.keys(finalInfo).map((card) => (<ClickableJobCard key={finalInfo[card]["id"]} id={finalInfo[card]["id"]} onclick={openDesc} data={{...finalInfo[card],'userType':"seekerq"}} />))
            }
        </div>
    )
}