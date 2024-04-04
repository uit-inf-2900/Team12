import React, { useState } from "react";
import ProjectCard from "../Components/ProjectCard";
import SwitchContainer from "../Components/SwitchContainer";
import MultiSelect from "../Components/MultiSelect"; // Pass på at denne importstien er korrekt
import '../GlobalStyles/main.css';

export const Stash = () => {
    const [activeStatus, setActiveStatus] = useState('needles');
    const [needleTypes, setNeedleTypes] = useState(['all']); // Oppdaterer til å støtte flere valg

    const projects = [
        { id: 1, size: '10', stash: 'needles', type: 'Replaceable' },
        { id: 2, size: '5', stash: 'needles', type: 'Set' },
        { id: 3, size: '3', stash: 'needles', type: 'Round' },
        { id: 4, title: 'Rauma Vams', stash: 'yarn' },
    ];

    const options = [
        { id: 'needles', label: 'Needles' },
        { id: 'yarn', label: 'Yarn' },
    ];

    const NeedlesOptions = [
        { value: 'All', name: 'All needles' },
        { value: 'Replaceable', name: 'Replaceable needles' },
        { value: 'Set', name: 'Set needles' },
        { value: 'Round', name: 'Round needles' },
    ];

    // Oppdaterer filtreringslogikken for å håndtere flere valg
    const filteredProjects = projects.filter(project => {
        if (activeStatus === 'needles') {
            if (needleTypes.includes('All') || needleTypes.length === 0) return project.stash === 'needles';
            return project.stash === activeStatus && needleTypes.includes(project.type);
        }
        return project.stash === activeStatus;
    });

    // Håndterer endring i MultiSelect
    const handleNeedleTypeChange = (event) => {
        const {
            target: { value },
        } = event;
        setNeedleTypes(
            // På en enhet, vri verdien til en streng, ellers, returner som en array
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div className="page-container">
            <h1> Stash </h1>      
            <SwitchContainer 
                options={options}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {activeStatus === 'needles' && (
                <table className="table">
                    
                    <thead>
                        <tr>
                            <MultiSelect
                                label="Needle Type"
                                value={needleTypes}
                                handleChange={handleNeedleTypeChange}
                                menuItems={NeedlesOptions}
                            />
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map(project => (
                            <tr key={project.id}>
                                <td>{project.type}</td>
                                <td>{project.size} mm</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Kortvisning for garn */}
            {activeStatus === 'yarn' && (
                <div className="box dark">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id}  title={project.title} stash={project.stash} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Stash;
