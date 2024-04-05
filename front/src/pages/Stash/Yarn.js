import React from "react";


const YarnStash = () => {

    const yarnStash = [
        { id: 4, title: 'Rauma Vams' },
    ];

    return (
        <div className="box dark">
            {yarnStash.map(yarn => (
                <div key={yarn.id} className="project-card">
                    <h3>{yarn.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default YarnStash;