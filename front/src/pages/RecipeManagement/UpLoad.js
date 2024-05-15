import React, { useState, useRef } from 'react';
import { IoIosCloudUpload } from "react-icons/io";          // Import the icon component from react icons library
import InputField from '../../Components/UI/InputField';
import './UpLoad.css';
import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/UI/Button';
import axios from 'axios';


const UpLoad = ({ onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({ fileName: '' });
    const fileInputRef = useRef(null);
    const [recipeInfo, setRecipeInfo] = useState({
        recipeName: '',
        author: '',
        needleSize: '',
        knittingGauge: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        setRecipeInfo({ ...recipeInfo, [e.target.name]: e.target.value });
    };

    const handleFileSelection = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setUploadStatus({ ...uploadStatus, fileName: selectedFile.name });
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
            onUploadSuccess(); // Call onUploadSuccess when upload is successful
        }).catch(error => {
            console.error("Upload error:", error);
        });
    };

    const clearFile = () => {
        setFile(null);
        setUploadStatus({ fileName: '' });
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
                        {uploadStatus.fileName && <p>{uploadStatus.fileName}</p>}
                    </div>

                    <div className="input">
                        <InputField label="RecipeName" name="recipeName" type="text" onChange={handleInputChange} />
                        <InputField label="Author" name="author" type="text" onChange={handleInputChange} />
                        <InputField label="Needle Size" name="needleSize" type="number" onChange={handleInputChange} />
                        <InputField label="Knitting Gauge" name="knittingGauge" type="text" onChange={handleInputChange} />
                        <InputField label="Notes" name="notes" type="text" onChange={handleInputChange} />
                    </div>
                </div>
                <CustomButton themeMode="light" onClick={onClose}> Close </CustomButton>
                {file && <CustomButton themeMode="dark" onClick={clearFile}>Cancel</CustomButton>}
                {file && <CustomButton themeMode="light" onClick={uploadFile} iconName="upload"> Upload</CustomButton>}
            </div>
        </div>
    );
};

export default UpLoad;
