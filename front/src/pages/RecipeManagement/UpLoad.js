import React, { useState, useRef } from 'react';
import "../../GlobalStyles/main.css";
import "./UpLoad.css"; 
import InputField from '../../Components/UI/InputField';
import { CustomButton } from '../../Components/UI/Button';
import axios from 'axios';
import { IoIosCloudUpload } from "react-icons/io";
import { Button, TextField, Box } from '@mui/material';


const UpLoad = ({ onClose, onUploadSuccess }) => {
    const [formErrors, setFormErrors] = useState({});
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [recipeInfo, setRecipeInfo] = useState({
        recipeName: '',
        author: '',
        needleSize: '',
        knittingGauge: '',
        notes: ''
    });

    // Select files from computer
    const handleFileSelection = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };


    // test that input is valid
    const validateInput = () => {
        let errors = {};
        if (!file) errors.file = 'A file is required.';
        if (!recipeInfo.recipeName.trim()) errors.recipeName = 'Recipe name is required.';
        if (!recipeInfo.needleSize.trim()) errors.needleSize = 'Needle size is required.';
        if (!recipeInfo.knittingGauge.trim()) errors.knittingGauge = 'Knitting gauge is required.';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // upload the file
    const uploadFile = () => {
        if (!validateInput()) {
            return;
        }

        const formData = new FormData();
        formData.append("RecipeFile", file);
        formData.append("UserToken", sessionStorage.getItem('token'));
        formData.append("RecipeName", recipeInfo.recipeName);
        formData.append("NeedleSize", parseInt(recipeInfo.needleSize));
        formData.append("KnittingGauge", recipeInfo.knittingGauge);
        formData.append("Notes", recipeInfo.notes);

        axios.post('http://localhost:5002/api/recipe/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log("Upload success:", response);
            onClose();
            onUploadSuccess();
        }).catch(error => {
            console.error("Upload error:", error);
        });
    };


    return (
        <div className="UpLoad-backdrop">
            <div className="UpLoad-content">
                {/* Place for uploading file */}
                <div className="box light" onClick={() => fileInputRef.current.click()}>
                    <IoIosCloudUpload size={50} />
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelection}
                        accept='.pdf'
                        style={{ display: 'none' }}
                    />
                    <p>{file ? file.name : formErrors.file && <span style={{ color: 'red' }}>{formErrors.file}</span>}</p>                </div>
                {/* Input fields for filling out info */}
                <div className="input">
                    <TextField
                        error={!!formErrors.recipeName}
                        helperText={formErrors.recipeName}
                        label="Recipe Name"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setRecipeInfo({ ...recipeInfo, recipeName: e.target.value })}
                    />
                    <TextField
                        error={!!formErrors.needleSize}
                        helperText={formErrors.needleSize}
                        label="Needle Size"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setRecipeInfo({ ...recipeInfo, needleSize: e.target.value })}
                    />
                    <TextField
                        error={!!formErrors.knittingGauge}
                        helperText={formErrors.knittingGauge}
                        label="Knitting Gauge"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setRecipeInfo({ ...recipeInfo, knittingGauge: e.target.value })}
                    />
                    <TextField label="Notes" variant="outlined" fullWidth name="notes" type="text" onChange={(e) => setRecipeInfo({...recipeInfo, notes: e.target.value})} />
                    <input
                type="file"
                onChange={handleFileSelection}
                style={{ display: 'none' }}
                ref={input => input && !file && input.setCustomValidity(formErrors.file || '')}
            />
                </div>
                {/* Buttons for closing, canceling, and uploading */}
                <CustomButton themeMode="light" onClick={onClose}>Close</CustomButton>
                {file && <CustomButton themeMode="dark" onClick={() => setFile(null)}>Cancel</CustomButton>}
                {file && <CustomButton themeMode="light" onClick={uploadFile}>Upload</CustomButton>}
            </div>
        </div>
    );
};

export default UpLoad;
