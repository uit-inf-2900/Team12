import React, { useState, useMemo } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import { NeedlesComponent } from "./Needles";
import MultiSelect from '../../Components/MultiSelect';


export const Stash = () => {
    // State for the selected filters and projects, yarn is the default for the switch container
    // and all is the default for the needle type filter
    const [activeStatus, setActiveStatus] = useState('yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']); 


    // TODO: Ta inn data fra backend i stedet for hardkodet data
    const needleStash = [
        { id: 1, size: '10', length: '40 cm', quantity: 5, inUse: true, type: 'Replaceable' },
        { id: 2, size: '5', length: '20 cm', quantity: 8, inUse: false, type: 'Set' },
        { id: 3, size: '3', length: '15 cm', quantity: 12, inUse: true, type: 'Round' },
        { id: 5, size: '3', length: '1 cm', quantity: 2, inUse: false, type: 'Heklenål' },
        { id: 6, size: '3', length: '7 cm', quantity: 2, inUse: false, type: 'Flettepinne' },
    ];

    const yarnStash = [
        { id: 4, title: 'Rauma Vams' },
    ];


    return (
        <div className="page-container">
            <h1>Stash</h1>
            {/* Choose if you want to look at needles or yarn  */}
            <SwitchContainer
                options={[{ id: 'needles', label: 'Needles' }, { id: 'yarn', label: 'Yarn' }]}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {/* If the needle status is chosen, show this section  */}
            {activeStatus === 'needles' && (
                <NeedlesComponent 
                    needleStash={needleStash} 
                    setNeedleTypes={setNeedleTypes} 
                    needleTypes={needleTypes} 
                />
            )}

            {activeStatus === 'yarn' && (
                <div className="box dark">
                    {yarnStash.map(project => (
                        <ProjectCard key={project.id} title={project.title} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Stash;
