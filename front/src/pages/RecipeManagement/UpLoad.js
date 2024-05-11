import React, { useState, useRef } from 'react';
import { IoIosCloudUpload } from "react-icons/io";          // Import the icon component from react icons library
import InputField from '../../Components/InputField';
import './UpLoad.css';
import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/Button';
import axios from 'axios';


// TODO: Implement file upload logic
// TODO: Implement error handling and feedback to the user


const UpLoad = ({ onClose, fetchRecipes }) => {
    // State to control the file input and upload status 
    const [file, setFile] = useState(null);                 
    const [uploadStatus, setUploadStatus] = useState({ fileName: '' });  
    const fileInputRef = useRef(null);             
    
    // State to control the recipe information input fields
    const [recipeInfo, setRecipeInfo] = useState({
        recipeName: '',
        author: '',
        needleSize: '',
        knittingGauge: '',
        notes: ''
    });

    // Function to handle input change
    const handleInputChange = (e) => {
        setRecipeInfo({ ...recipeInfo, [e.target.name]: e.target.value });
    };

    // Function to handle file selection
    const handleFileSelection = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setUploadStatus({ ...uploadStatus, fileName: selectedFile.name });
    };

    // Handle the file upload
    const uploadFile = () => {
        // TODO: Implement file upload logic
        const formData = new FormData(); 

        formData.append("RecipeFile", file);
        formData.append("UserToken", sessionStorage.getItem('token'));
        formData.append("RecipeName", recipeInfo.recipeName);
        formData.append("NeedleSize", parseInt(recipeInfo.needleSize));
        formData.append("KnittingGauge", recipeInfo.knittingGauge);

        axios.post('http://localhost:5002/api/recipe/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(reponse => {
            console.log("Upload success:", reponse);
        }).catch(error => {
            // Handle error 
            console.error("Upload error:", error);
        })
        fetchRecipes();
    };


    // Function to clear the file 
    const clearFile = () => {
        setFile(null);
        setUploadStatus({ fileName: '' });
    };

    return (
        <div className="UpLoad-backdrop">
            <div className="UpLoad-content">
                
                <div className="upload-flex-container"> 
                    <div className="box light" 
                        style={{"border-radius": "50%", 
                                "width": "200px", 
                                "height": "200px", 
                                "border": "2px dashed #ccc", 
                                "cursor": "pointer", 
                                "overflow": "hidden"}} 
                        onClick={() => fileInputRef.current.click()}>
                        <IoIosCloudUpload size={50} />   {/* The upload icon */}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            onChange={handleFileSelection} 
                            accept='.pdf, .jpg, .jpeg, .png, .svg'      // Can only choose from these types 
                            style={{ display: 'none' }}
                        />
                        {uploadStatus.fileName && <p>{uploadStatus.fileName}</p>}
                    </div>
                    
                    {/* Skjema for oppskriftsinformasjon */}
                    <div className="input">
                        <InputField label="RecipeName" name="recipeName" type="text" onChange={handleInputChange} />
                        <InputField label="Author" name="author"  type="text" onChange={handleInputChange} />
                        <InputField label="Needle Size" name="needleSize"  type="number" onChange={handleInputChange} />
                        <InputField label="Knitting Gauge" name="knittingGauge"  type="text" onChange={handleInputChange}  />
                        <InputField label="Notes" name="notes"   type="text"onChange={handleInputChange}  />
                    </div>
                </div>
                {/* Buttons to clear and upload files. Should only be viseble if a file is uploaded */}
                {file && <CustomButton themeMode="dark" onClick={clearFile}>Cancel</CustomButton>}           
                {file && <CustomButton themeMode="light" onClick={uploadFile} iconName="upload"> Upload</CustomButton>}
            </div>
        </div>
    );
};

export default UpLoad;