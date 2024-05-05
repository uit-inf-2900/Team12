import React, { useState } from 'react';
import InputField from '../../../Components/InputField';
import { CustomButton } from '../../../Components/Button';
import SetAlert from '../../../Components/Alert';


const NeedleInfo = ({onClose, fetchNeedles}) => {
    const [alertInfo, setAlertInfo] = useState({open: false, severity: 'info', message: 'test message'});

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

        // Check if all fields are filled in
        if (!needleData.type || !needleData.size || !needleData.length || (needleData.type === 'Other' && !needleData.otherType)) {
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Please fill in all fields.'
            });
            return;
        }

        // Get the payload ready for the POST request
        const payload = {
            userToken: needleData.userToken,
            type: needleData.type === 'Other' ? needleData.otherType : needleData.type,
            size: parseInt(needleData.size, 10),
            length: parseInt(needleData.length, 10)
        };

        // POST request to the API
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
                setAlertInfo({
                    open: true,
                    severity: 'success',
                    message: 'Needle uploaded successfully'
                });
                onClose();          // This function call will close the modal
                fetchNeedles(); 
            } else {
                const errorResult = await response.json();
                setAlertInfo({
                    open: true,
                    severity: 'error',
                    message: errorResult.message || 'An unexpected error occurred'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'An error occurred while uploading the needle.'
            });
        }
    };

    return (
        <div className="pop">
            <div className="pop-content" style={{height: '60%', width: '50%', alignContent:'center'}}>
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
                    <CustomButton themeMode="light" submit={true}>Upload needle</CustomButton>
                    <CustomButton themeMode="light" onClick={onClose}>Cancel</CustomButton>
                </form>
                <SetAlert
                    open={alertInfo.open} 
                    setOpen={(isOpen) => setAlertInfo({...alertInfo, open: isOpen})} 
                    severity={alertInfo.severity} 
                    message={alertInfo.message} />
            </div>
        </div>
    );
}

export default NeedleInfo;
