import React from "react";
import Card from "../../../Components/Card";

const YarnStash = () => {

    const yarnStash = [
        { id: 4, title: 'Rauma Vams', yarntype:'wool', color: 'blue', weight: 'fingering', skeinsYarn: 2 },
    ];

    return (
        <div className="yarn-container">
            {yarnStash.map(yarn => (
                <Card
                    key={yarn.id}
                    title={yarn.title}
                    yarntype={yarn.yarntype}
                    color={yarn.color}
                    weight={yarn.weight}
                    skeinsYarn={yarn.skeinsYarn}
                />
            ))}
        </div>
    ); 
};

export default YarnStash;