import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import FeatureBox from '../../components/FeatureBox/FeatureBox';
import FeatureBoxMiddlePane from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePane';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
import AddSkills from '../../components/AddSkills/AddSkills';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './ProfileSection.css';
export default function ProfileSection({ data }) {
    const [skill, SetSkill] = useState('');
    const [skills, SetSkills] = useState([{ tag: "software", id: uuid() }, { tag: "data science", id: uuid() }]);

    const handleDeleteSkill = (id) => {
        //accepts id of Domain tag and delete them from the array 
        SetSkills(prevSkills =>
            prevSkills.filter(e => e.id !== id))
    };

    const handleChangeSkill = (v) => {
        //stores the Domain value from the input field as user types
        SetSkill(v)
    };

    const handleSkill = (n) => {
        //accepts a new domain value from the input field and updates the domains array to display the newly added domain and resets the input box value when user clicks the add button
        if (n !== "") {
            SetSkills([...skills, { tag: n, id: uuid() }]);
            SetSkill('')
        }
    };


    return (
        <div id="profile-page">
            <ProfileHead data={data} />
            <NavigationBar active="profile"/>
            <div className="profile-body-section">
                <div className="profile-pane profile-left-pane">
                    {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                    <ContactCard data={{
                        title: "Contacts and Profiles", addIcon: false, editIcon: true
                    }} contactInfo={{ mail:"amywilliams@gmail.com",github:"amywilliams",website:"amywilliams.com"}} />
                </div>
                <div className="profile-pane profile-middle-pane">
                    <FeatureBoxMiddlePane data={{ title: "Professional Experience", editIcon: true, isLanguage: false }}
                        childData={[
                            { qualification: "Master of science - Computer Science", qualificationProvider: "Massachusetts Institute of Technology (MIT)", qualifiedYear: "2005 - 2009  " },
                            { qualification: "Master of science - Computer Science", qualificationProvider: "Massachusetts Institute of Technology (MIT)", qualifiedYear: "2005 - 2009  " }
                        ]} />



                    <FeatureBoxMiddlePane data={{ title: "Formal Education", editIcon: true, isLanguage: false }}
                        childData={[
                            { qualification: "Master of science - Computer Science", qualificationProvider: "Massachusetts Institute of Technology (MIT)", qualifiedYear: "2005 - 2009  " },
                            { qualification: "Master of science - Computer Science", qualificationProvider: "Massachusetts Institute of Technology (MIT)", qualifiedYear: "2005 - 2009  " }
                        ]} />
                    <FeatureBoxMiddlePane data={{ title: "Licenses and certifications ", editIcon: true, isLanguage: false }}
                        childData={[
                            { qualification: "Master of science - Computer Science", qualificationProvider: "Massachusetts Institute of Technology (MIT)", qualifiedYear: "2005 - 2009  " },
                            { qualification: "Master of science - Computer Science", qualificationProvider: "Massachusetts Institute of Technology (MIT)", qualifiedYear: "2005 - 2009  " }
                        ]} />
                    {/* <FeatureBoxMiddlePane data={{ title: "Skills",editIcon:false }} /> */}
                    <AddSkills id="profile-section-skills" value={skill} tags={skills} deleteFn={handleDeleteSkill} changeFn={handleChangeSkill} updateFn={handleSkill} data={{ title: "Skills", inputPlaceholder: "HTML" }} />
                    <FeatureBoxMiddlePane data={{ title: "Languages", editIcon: true, isLanguage: true}}
                        childData={[
                            { language: "English", languageProficiency:"Professional working proficiency"},
                            { language: "English", languageProficiency: "Professional working proficiency" }
                        ]} />
                    <div className="spacer-div" ></div>
                </div>
                <div className="profile-pane profile-right-pane">
                    <FeatureBox data={{ title: "Achievements", addIcon: true, editIcon: true }} />
                </div>
                          </div>
        </div>
    )
}