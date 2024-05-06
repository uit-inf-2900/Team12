import React, { useState } from 'react';
import InputField from '../../../Components/InputField';
import { CustomButton } from '../../../Components/Button';
import SetAlert from '../../../Components/Alert';
import {getImageByName} from '../../../images/getImageByName'


const NeedleInfo = ({onClose, fetchNeedles}) => {
    const [alertInfo, setAlertInfo] = useState({ open: false, severity: 'info', message: 'test message' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');

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
        // Clear field specific error
        if (fieldErrors[prop]) {
            setFieldErrors({ ...fieldErrors, [prop]: false });
        }
    };

    const handleTypeChange = (event) => {
        const { value } = event.target;
        setNeedleData({ ...needleData, type: value, otherType: value === 'Other' ? '' : needleData.otherType });
        if (fieldErrors.type) {
            setFieldErrors({ ...fieldErrors, type: false });
        }
    };
    

    const validateFields = () => {
        const errors = {};
        if (!needleData.type) errors.type = true;
        if (!needleData.size) errors.size = true;
        if (!needleData.length) errors.length = true;
        if (needleData.type === 'Other' && !needleData.otherType) errors.otherType = true;
        return errors;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateFields();

        // Check if all fields are filled in
        if (!needleData.type || !needleData.size || !needleData.length || (needleData.type === 'Other' && !needleData.otherType)) {
            setFieldErrors(errors);
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
                setError(errorResult.message || 'An unexpected error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while uploading the needle.');
        }
    };

    return (
        <div className="pop">
            <div className="pop-content" style={{height: '50%', width: '30%', alignContent:'center', overflow:'auto'}}>
                <form onSubmit={handleSubmit}>
                    <h2>Please add the information about you needle</h2>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '60%', padding: '10px' }}>
                            <InputField 
                                label="Type" 
                                type="select"
                                value={needleData.type}
                                onChange={handleTypeChange}
                                options={[
                                    { value: 'Interchangeable', label: 'Interchangeable Needles' },
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
                                    errors = {error.type}
                                />
                            )}
                            <InputField 
                                label="Needle Size" 
                                type="number"
                                value={needleData.size}
                                onChange={handleChange('size')}
                                errors={error.needleSize}
                            />
                            <InputField 
                                label="Needle Length"
                                type="number"
                                value={needleData.length}
                                onChange={handleChange('length')}
                                errors={error.needleLenth}
                            />
                        </div>
                        <div style={{ flex: '40%', padding: '10px', textAlign: 'center' }}>
                            <img src={getImageByName('yarnBasket')} alt="Yarn Basket" style={{ maxWidth: '70%', height: 'auto' }} />
                        </div>
                    </div>

                    {error && <div className="errorMsg">{error}</div>}
                    
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
