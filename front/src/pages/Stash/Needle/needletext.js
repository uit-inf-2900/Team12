import React, {useState} from 'react';
import InputField from '../../../Components/InputField';
import { ThemeProvider } from '@mui/material/styles'; 
import Theme from '../../../Components/Theme';

const NeedleInfo = () => {
    const [needleData, setNeedleData] = useState({
        type: '', 
        size: '',
        length: ''
    });

    const handleChange = (prop) => (event) => {
        setNeedleData({ ...needleData, [prop]: event.target.value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/api/needles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(needleData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                // Tilbakestill skjema eller gi tilbakemelding til bruker
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ThemeProvider theme={Theme}>
            <div className="box dark">
                <h3>Hei,</h3>
                <p>HER KOMMER PINNE INFO</p>

                <form onSubmit={handleSubmit}>
                    {/* Categorize the type needle you have, either one of the predefines, or yourn own */}
                    <InputField 
                        label="Type" 
                        type="select"
                        value={needleData.type}
                        onChange={handleChange('type')}
                        options={[
                            { value: 'Replaceable', label: 'Replaceable' },
                            { value: 'Set', label: 'Set' },
                            { value: 'Round', label: 'Round' },
                            { value: 'Other', label: 'Other (Specify)' }
                        ]}
                    />
                        {needleData.type === 'Other' && (
                        <InputField 
                            label="Specify Other Type"
                            type="text"
                            value={needleData.otherType}
                            onChange={handleChange('otherType')}
                        />
                    )}
                    <InputField 
                        label="Needle Size" 
                        type="number"
                        value={needleData.size}
                        onChange={handleChange('size')}
                    />
                    <InputField 
                        label="Needle Length"
                        type="number"
                        value={needleData.length}
                        onChange={handleChange('length')}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </ThemeProvider>
    );
}

export default NeedleInfo;