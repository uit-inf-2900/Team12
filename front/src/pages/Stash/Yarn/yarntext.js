import React, {useState} from 'react';
import "../../../GlobalStyles/main.css";
import "../../Counter.css";
import { CustomButton } from '../../../Components/Button';
import InputField from '../../../Components/InputField';
import yarnBasket from '../../../images/yarnSheep.png';
import SetAlert from '../../../Components/Alert';

const TextYarn = ({onClose, fetchYarns}) => {
    const [alertInfo, setAlertInfo] = useState({open: false, severity: 'info', message: 'test message'});
    const token = sessionStorage.getItem('token');
    const [yarnData, setYarnData] = useState({
        UserToken: token,
        Manufacturer: '',
        Type: '',
        Weight: '',
        Length: '',
        Gauge: '',
        Color: '',
        Batch_Number: '',
        Notes: ''
    });

    // Function to update yarn details state
    const handleChange = (prop) => (event) => {
        setYarnData({ ...yarnData, [prop]: event.target.value});
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if all fields are filled in
        if (!yarnData.Type || !yarnData.Manufacturer || !yarnData.Color) {
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Please fill in all fields.'
            });
            return;
        }
        
        // Get the payload ready for the POST request
        const payload = {
            UserToken: yarnData.UserToken,
            ItemId: yarnData.ItemId,
            Type: yarnData.Type,
            Manufacturer: yarnData.Manufacturer,
            Color: yarnData.Color,
            Batch_Number: yarnData.Batch_Number,
            Weight: parseInt(yarnData.Weight, 10),
            Length: parseInt(yarnData.Length, 10),
            Gauge: yarnData.Gauge,
            Notes: yarnData.Notes
        };

        // POST request to the API
        const response = await fetch('http://localhost:5002/api/inventory/addyarn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
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
            onClose();
            fetchYarns();
        } else {
            const errorResult = await response.json();
            setAlertInfo({
                open: true,
                severity: 'error',
                message: errorResult.message || 'An unexpected error occurred'
            });
        }
    };

    return (
        <div className="pop">
            <div className="pop-content" style={{height: '80%', width: '50%', alignContent:'center'}}>
                <h2> Add Yarn </h2>
                <form onSubmit={handleSubmit} className="yarn-form" style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 auto' }}>
                        <div className="input-wrapper" style={{  width: 'calc(50% + 100px)', marginRight: '10px'}}>
                            <InputField label="Brand" type="text" value={yarnData.Manufacturer} onChange={handleChange('Manufacturer')}/>
                            <InputField label="Length" type="text" value={yarnData.Length} onChange={handleChange('Length')}/>
                            <InputField label="Gauge" type="text" value={yarnData.Gauge} onChange={handleChange('Gauge')}/>
                            <InputField label="Color" type="text" value={yarnData.Color} onChange={handleChange('Color')}/>
                        </div>
                        <div className="input-wrapper" style={{ width: 'calc(50% + 100px)'}}>
                            <InputField label="Type" type="text" value={yarnData.Type} onChange={handleChange('Type')}/>
                        </div>
                    </div>
                    <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
                        <div className="input-wrapper" style={{  width: 'calc(50% + 100px)'}}></div>
                        <div style={{ width: '40%', alignItems: 'center', marginTop: '-190px'}}>
                            <img src={yarnBasket} alt="Yarn Basket" />
                        </div>
                    </div>
                    <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 auto' }}>
                        <div className="input-wrapper" style={{  width: 'calc(50% + 100px)', marginRight: '10px'}}>
                            <InputField label="Weight" type="number" value={yarnData.Weight} onChange={handleChange('Weight')}/>
                        </div>
                        <div className="input-wrapper" style={{ width: 'calc(50% + 100px)'}}>
                        <InputField label="Batch number" type="text" value={yarnData.Batch_Number} onChange={handleChange('Batch_Number')}/>
                        </div>
                    </div>
                    <div className="input-wrapper" style={{ width:'100%', marginBottom: '10px'}}>
                        <InputField label="Notes" type="text" multiline rows={4} value={yarnData.Notes} onChange={handleChange('Notes')}/>
                    </div>
                    <div className="counter-controls">
                        <CustomButton themeMode="light" submit={true}>Add</CustomButton>
                        <CustomButton themeMode="light" onClick={onClose}>Cancel</CustomButton>
                    </div>
                </form>
                <SetAlert
                    open={alertInfo.open} 
                    setOpen={(isOpen) => setAlertInfo({...alertInfo, open: isOpen})} 
                    severity={alertInfo.severity} 
                    message={alertInfo.message} />
            </div>
        </div>
    )
}

export default TextYarn;
