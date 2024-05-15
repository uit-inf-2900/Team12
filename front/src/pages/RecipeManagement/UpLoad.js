import React, { useState, useRef } from 'react';
import "../../GlobalStyles/main.css";
import InputField from '../../Components/UI/InputField';
import { CustomButton } from '../../Components/UI/Button';
import axios from 'axios';
import { IoIosCloudUpload } from "react-icons/io";

const UpLoad = ({ onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [recipeInfo, setRecipeInfo] = useState({
        recipeName: '',
        author: '',
        needleSize: '',
        knittingGauge: '',
        notes: ''
    });

    const handleFileSelection = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const uploadFile = () => {
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
                <div className="upload-flex-container">
                    <div className="box light" onClick={() => fileInputRef.current.click()}>
                        <IoIosCloudUpload size={50} />
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelection}
                            accept='.pdf'
                            style={{ display: 'none' }}
                        />
                        <p>{file && file.name}</p>
                    </div>
                    <div className="input">
                        <InputField label="RecipeName" name="recipeName" type="text" onChange={(e) => setRecipeInfo({...recipeInfo, recipeName: e.target.value})} />
                        <InputField label="Author" name="author" type="text" onChange={(e) => setRecipeInfo({...recipeInfo, author: e.target.value})} />
                        <InputField label="Needle Size" name="needleSize" type="number" onChange={(e) => setRecipeInfo({...recipeInfo, needleSize: e.target.value})} />
                        <InputField label="Knitting Gauge" name="knittingGauge" type="text" onChange={(e) => setRecipeInfo({...recipeInfo, knittingGauge: e.target.value})} />
                        <InputField label="Notes" name="notes" type="text" onChange={(e) => setRecipeInfo({...recipeInfo, notes: e.target.value})} />
                    </div>
                </div>
                <CustomButton themeMode="light" onClick={onClose}>Close</CustomButton>
                {file && <CustomButton themeMode="dark" onClick={() => setFile(null)}>Cancel</CustomButton>}
                {file && <CustomButton themeMode="light" onClick={uploadFile}>Upload</CustomButton>}
            </div>
        </div>
    );
};

export default UpLoad;
