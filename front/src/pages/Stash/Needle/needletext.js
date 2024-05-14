import React, { useState, useCallback } from 'react';
import InputField from '../../../Components/UI/InputField';
import { CustomButton } from '../../../Components/UI/Button';
import SetAlert from '../../../Components/UI/Alert';
import { getImageByName } from '../../../images/getImageByName';

const NeedleInfo = ({ onClose, fetchNeedles }) => {
    const [error, setError] = useState({
        alertInfo: { open: false, severity: 'info', message: 'Test message' },
        fieldErrors: {},
        needleData: {
            userToken: sessionStorage.getItem('token'),
            type: '',
            size: '',
            length: '',
            otherType: ''
        }
    });

    // Handle field value changes and validate the field.
    const handleChange = useCallback((prop) => (event) => {
        const { value } = event.target;
        setError(prev => ({
            ...prev,
            needleData: { ...prev.needleData, [prop]: value },
            fieldErrors: { ...prev.fieldErrors, [prop]: !value }
        }));
    }, []);

    // Specialized change handler for the needle type field
    const handleTypeChange = useCallback((event) => {
        const { value } = event.target;
        setError(prev => ({
            ...prev,
            needleData: {
                ...prev.needleData,
                type: value,
                otherType: value === 'Other' ? '' : prev.needleData.otherType
            },
            fieldErrors: { ...prev.fieldErrors, type: false }
        }));
    }, []);

    // Validate all required fields and provide specific error messages.
    const validateFields = useCallback(() => {
        const { type, size, length, otherType } = error.needleData;
        const errors = {};
        if (!type) errors.type = 'Needle type is required';
        if (!size) errors.size = 'Needle size is required';
        if (!length) errors.length = 'Needle length is required';
        if (type === 'Other' && !otherType) errors.otherType = 'Please specify the needle type';
        return errors;
    }, [error.needleData]);

    // Handle form submission with validation and server request.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateFields();

        if (Object.keys(errors).length > 0) {
            setError(prev => ({
                ...prev,
                fieldErrors: errors,
                alertInfo: { open: true, severity: 'error', message: 'Please check the highlighted fields.' }
            }));
            return;
        }

        const { userToken, type, size, length } = error.needleData;
        const payload = {
            userToken,
            type: type === 'Other' ? error.needleData.otherType : type,
            size: parseInt(size, 10),
            length: parseInt(length, 10)
        };

        try {
            const response = await fetch('http://localhost:5002/api/inventory/addneedle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                setError(prev => ({
                    ...prev,
                    alertInfo: { open: true, severity: 'success', message: 'Needle uploaded successfully' }
                }));

                onClose();
                fetchNeedles();
            } else {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'An unexpected error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(prev => ({ ...prev, error: error.message }));
        }
    };

    return (
        <div className="pop">
            <div className="pop-content" style={{ height: 'auto', maxWidth: '40%', alignContent: 'center', overflow: 'auto' }}>
                <form onSubmit={handleSubmit}>
                    <h2>Please add the information about your needle</h2>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '60%', padding: '10px' }}>
                            <InputField 
                                label="Type" 
                                type="select"
                                value={error.needleData.type}
                                onChange={handleTypeChange}
                                options={[
                                    { value: 'Interchangeable', label: 'Interchangeable Needles' },
                                    { value: 'DoublePointed', label: 'Double Pointed' },
                                    { value: 'Circular', label: 'Circular' },
                                    { value: 'Other', label: 'Other (Specify)' }
                                ]}
                                errors={error.fieldErrors.type}
                            />
                            {error.needleData.type === 'Other' && (
                                <InputField 
                                    label="Specify Other Type"
                                    type="text"
                                    value={error.needleData.otherType || ''}
                                    onChange={handleChange('otherType')}
                                    errors={error.fieldErrors.otherType}
                                />
                            )}
                            <InputField 
                                label="Needle Size" 
                                type="number"
                                value={error.needleData.size}
                                onChange={handleChange('size')}
                                errors={error.fieldErrors.size}
                            />
                            <InputField 
                                label="Needle Length"
                                type="number"
                                value={error.needleData.length}
                                onChange={handleChange('length')}
                                errors={error.fieldErrors.length}
                            />
                        </div>
                        <div style={{ flex: '40%', padding: '10px', textAlign: 'center' }}>
                            <img src={getImageByName('yarnBasket')} alt="Yarn Basket" style={{ maxWidth: '80%', height: 'auto' }} />
                        </div>
                    </div>
                    {error.error && <div>{error.error}</div>}
                    <CustomButton themeMode="light" submit={true}>Upload needle</CustomButton>
                    <CustomButton themeMode="light" onClick={onClose}>Cancel</CustomButton>
                </form>
                <SetAlert
                    open={error.alertInfo.open} 
                    setOpen={(isOpen) => setError(prev => ({ ...prev, alertInfo: { ...prev.alertInfo, open: isOpen } }))}
                    severity={error.alertInfo.severity} 
                    message={error.alertInfo.message} />
            </div>
        </div>
    );
}

export default NeedleInfo;
