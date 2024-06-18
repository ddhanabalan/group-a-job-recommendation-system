import './Jobs.css';
import { useState, useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import JobDesciptionForm from '../JobDescription/JobDesciption';


function ClickableJobCard({id, data, onclick})
{
    return(
        <div className='clickable-job-card' onClick={()=>onclick(id)}>
            <JobCard data={data}/>
        </div>
    )
}
export default function Jobs({data, dataToParentFn=null, desc_state=null, userData}) {
    
    const finalInfo={...data};
    //const userType="none";
    
    //const parentDescState=desc_state?desc_state:false;
    const [descriptionOn, setDesc] = useState(desc_state?desc_state:false);
    const [selectedId, setId] = useState(null);
    //console.log("final data info" ,finalInfo);
    function openDesc(id){
        setDesc(true);
        setId(id);
        console.log("selected id", id);
    }
    //console.log("description status job component",descriptionOn);

    useEffect(()=>{
        if(dataToParentFn)dataToParentFn(descriptionOn)
        },[descriptionOn])
    useEffect(() => {
        if (desc_state !== null) setDesc(desc_state);
        //console.log("changed");
        }, [desc_state]);


    return (

        <div className="cards-container">
            {descriptionOn?
            <JobDesciptionForm data={finalInfo[selectedId]} userData={userData}/>
            :
            Object.keys(finalInfo).map((card) => (<ClickableJobCard key={finalInfo[card]["id"]} id={finalInfo[card]["id"]} onclick={openDesc} data={{...finalInfo[card],'userType':"seekerq"}} />))
            }
        </div>
    )
}