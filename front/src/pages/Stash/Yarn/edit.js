import React, {useState, useEffect} from 'react';
import "../../../GlobalStyles/main.css";
import "../../Counter.css";
import CustomButton from '../../../Components/Button';
import InputField from '../../../Components/InputField';
import yarnBasket from '../../../images/yarnSheep.png';
import { Modal, Box, TextField, Button } from "@mui/material";

const EditYarn = ({ yarn, open, onClose, onSave }) => {
    const token = sessionStorage.getItem('token');
    const [formData, setFormData] = useState({
        UserToken: token,
        Manufacturer: '',
        Type: '',
        Weight: '',
        Length: '',
        Gauge: '',      // Ensure this field is added if used
        Color: '',
        Batch_Number: '', // Changed to camelCase
        Notes: ''
    });

    useEffect(() => {
        if (yarn) {
            setFormData({
                UserToken: yarn.UserToken || '',
                Type: yarn.Type || '',
                Manufacturer: yarn.Manufacturer || '',
                Color: yarn.color || '',
                Batch_Number: yarn.Batch_Number || '', // Changed to camelCase
                Weight: yarn.Weight || '',
                Length: yarn.Length || '',
                Gauge: yarn.Gauge || '',       // Ensure this field is added if used
                Notes: yarn.Notes || ''
            });
        }
    }, [yarn]);

    const handleChange = (name) => (event) => {
        setFormData(prev => ({ ...prev, [name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
    };

    return (
        <div className="pop">
            <div className="pop-content" style={{height: '95%', width: '50%', alignContent:'center'}}>
                <h2>Edit Yarn</h2>
                <form onSubmit={handleSubmit} className="yarn-form" style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 auto' }}>
                        <div className="input-wrapper" style={{  width: 'calc(50% + 100px)', marginRight: '10px'}}>
                            <InputField
                                label="Brand"
                                type="text"
                                value={formData.Manufacturer}
                                onChange={handleChange('Manufacturer')}
                            />
                            
                            <InputField
                                label="Length"
                                type="text"
                                value={formData.Length}
                                onChange={handleChange('Length')}
                            />
                            <InputField
                                label="Gauge"
                                type="text"
                                value={formData.Gauge}
                                onChange={handleChange('Gauge')}
                            />
                            <InputField
                                label="Color"
                                type="text"
                                value={formData.Color}
                                onChange={handleChange('Color')}
                            />
                        </div>
                        <div className="input-wrapper" style={{ width: 'calc(50% + 100px)'}}>
                            <InputField
                                label="Type"
                                type="text"
                                value={formData.Type}
                                onChange={handleChange('Type')}
                            />
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
                            <InputField
                                label="Weight"
                                type="number"
                                value={formData.Weight}
                                onChange={handleChange('Weight')}
                            />
                        </div>
                        <div className="input-wrapper" style={{ width: 'calc(50% + 100px)'}}>
                        <InputField
                                label="Batch number"
                                type="text"
                                value={formData.Batch_Number}
                                onChange={handleChange('Batch_Number')}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper" style={{ width:'100%', marginBottom: '10px'}}>
                        <InputField
                            label="Notes"
                            type="text"
                            multiline
                            rows={4}
                            value={formData.Notes}
                            onChange={handleChange('Notes')}
                            
                        />
                    </div>
                    <div className="counter-controls">
                        <CustomButton themeMode="light" submit={true}>Add</CustomButton>
                        <CustomButton themeMode="light" onClick={onClose}>Cancel</CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditYarn;
