import React, { useState } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import MultiSelect from "../../Components/MultiSelect";
import '../../GlobalStyles/main.css';



// TODO: legge til en type som heter annen, hvor man selv kan skrive inn typen, feks flettepinne eller heklenål

export const Stash = () => {
    const [activeStatus, setActiveStatus] = useState('needles');
    const [needleTypes, setNeedleTypes] = useState(['all']);

    // Separerte arrays for needles og yarn
    const needleStash = [
        { id: 1, size: '10', length: '40 cm', quantity: 5, inUse: true, type: 'Replaceable' },
        { id: 2, size: '5', length: '20 cm', quantity: 8, inUse: false, type: 'Set' },
        { id: 3, size: '3', length: '15 cm', quantity: 12, inUse: true, type: 'Round' },
    ];

    const yarnStash = [
        { id: 4, title: 'Rauma Vams' },
        // Flere garnprosjekter...
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

    const handleNeedleTypeChange = (event) => {
        const { target: { value } } = event;
        setNeedleTypes(typeof value === 'string' ? value.split(',') : value);
    };

    // Filtrer basert på activeStatus og needleTypes
    const filteredNeedleStashs= needleStash.filter(project => {
        return needleTypes.includes('All') || needleTypes.includes(project.type);
    });

    return (
        <div className="page-container">
            <h1> Stash </h1>
            <SwitchContainer
                options={options}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {activeStatus === 'needles' && (
                <>
                    <MultiSelect
                        label="Needle Type"
                        value={needleTypes}
                        handleChange={handleNeedleTypeChange}
                        menuItems={NeedlesOptions}
                    />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Length</th>
                                <th>Quantity</th>
                                <th>In Use</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNeedleStashs.map(project => (
                                <tr key={project.id}>
                                    <td>{project.type}</td>
                                    <td>{project.size} mm</td>
                                    <td>{project.length}</td>
                                    <td>{project.quantity}</td>
                                    <td>{project.inUse ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
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
