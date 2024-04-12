import React, { useState } from 'react';
import InputField from '../../../Components/InputField';
import { ThemeProvider } from '@mui/material/styles'; 
import Theme from '../../../Components/Theme';
import CustomButton from '../../../Components/Button';

const NeedleInfo = () => {
    const token = sessionStorage.getItem('token');  // Fetching the token from session storage
    const [needleData, setNeedleData] = useState({
        userToken: token,  // Using the fetched token
        type: '', 
        size: '',
        length: '',
        otherType: ''  // Initialize the otherType for 'Other' option
    });

    const handleChange = (prop) => (event) => {
        setNeedleData({ ...needleData, [prop]: event.target.value });
    };

    const handleTypeChange = (event) => {
        const { value } = event.target;
        setNeedleData({ ...needleData, type: value, otherType: value === 'Other' ? '' : needleData.otherType });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            userToken: needleData.userToken,
            type: needleData.type === 'Other' ? needleData.otherType : needleData.type,
            size: parseInt(needleData.size, 10),
            length: parseInt(needleData.length, 10)
        };

        try {
            const response = await fetch('http://localhost:5002/api/inventory/addneedle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'  // Making sure the accept header is included if needed
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                // Reset form or provide feedback to the user here
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
                    <InputField 
                        label="Type" 
                        type="select"
                        value={needleData.type}
                        onChange={handleTypeChange}
                        options={[
                            { value: 'Interchangeble', label: 'Interchangeble Needles' },
                            { value: 'DoublePointed', label: 'DoublePointed' },
                            { value: 'Circular', label: 'Circular' },
                            { value: 'Other', label: 'Other (Specify)' }
                        ]}
                    />
                    {needleData.type === 'Other' && (
                        <InputField 
                            label="Specify Other Type"
                            type="text"
                            value={needleData.otherType || ''}
                            onChange={(e) => setNeedleData({...needleData, otherType: e.target.value})}
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
                    <CustomButton themeMode="light" submit={true}>Sign up</CustomButton>
                </form>
            </div>
        </ThemeProvider>
    );
}

export default NeedleInfo;
