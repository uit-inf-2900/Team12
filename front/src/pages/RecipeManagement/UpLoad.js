import React, { useState, useRef } from 'react';
import './UpLoad.css';
import { IoIosCloudUpload } from "react-icons/io";          // Import the icon component from react icons library

const UpLoad = ({ onClose }) => {
    const [file, setFile] = useState(null);                 // State to keep track of files
    const [uploadStatus, setUploadStatus] = useState({ progress: 0, fileName: '' });   // State to track upload progress (NOT WORKING)
    const fileInputRef = useRef(null);                      // Ref for file input
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

    // Handle the file upload
    const uploadFile = () => {
        // TODO: Implement file upload logic
    };

    // Function to clear the file list 
    // NOTE: do not need it if we only allow one file to be uploaded at a time
    const clearFile = () => {
        setFile(null);
        setUploadStatus({ progress: 0, fileName: '' });
    };

    return (
        <div className="UpLoad-backdrop">
            <div className="UpLoad-content">
                <button className="UpLoad-close" onClick={onClose}>X</button>
                <div className="upload-flex-container"> {/* Ny flex-container */}
                    <div className="UpLoad-area" onClick={() => fileInputRef.current.click()}>
                        <IoIosCloudUpload size={50} />
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
                    <div className="recipe-info-form">
                        <input name="recipeName" placeholder="Navn på oppskrift" onChange={handleInputChange} />
                        <input name="author" placeholder="Forfatter" onChange={handleInputChange} />
                        <input name="needleSize" placeholder="Pinnestørrelse" onChange={handleInputChange} />
                        <input name="knittingGauge" placeholder="Strikke fasthet (XX/XX)" onChange={handleInputChange} />
                        <textarea name="notes" placeholder="Notater" onChange={handleInputChange}></textarea>
                    </div>
                </div>
                {/* Buttons to clear and upload files. Should only be viseble if a file is uploaded */}
                {file && <button className="UpLoad-clear" onClick={clearFile}>Fjern</button>}           
                {file && <button className="UpLoad" onClick={uploadFile}>Last opp</button>}
            </div>
        </div>
    );
};

export default UpLoad;