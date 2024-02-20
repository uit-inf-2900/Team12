import React, { useState, useRef } from 'react';
import './UpLoad.css'; 
import { IoIosCloudUpload } from "react-icons/io"; // Import the icon

const UpLoad = ({ onClose }) => {
    const [files, setFiles] = useState([]);                     // State to keep track of files
    const [uploadStatus, setUploadStatus] = useState({});   // State to track upload progress (NOT WORKING)
    const fileInputRef = useRef(null);                          // Ref for file input


    // Handles the selection of files and sets up initial upload progress
    const handleFileSelection = (event) => {
        const selectedFiles = event.target.files;
        const fileStatuses = {};
        Array.from(selectedFiles).forEach(file => {
            fileStatuses[file.name] = { progress: 0, complete: false }; // Initial progress is 0
        });
        setUploadStatus(fileStatuses);
        setFiles(selectedFiles);
    };

    // Handle the file upload
    const uploadFiles = () => {
        // TODO: Implement file upload logic
    };

    // Function to clear the file list
    const clearFiles = () => {
        setFiles([]);
        setUploadStatus({});
    };

    return (
        <div className="UpLoad-backdrop">
            <div className="UpLoad-content">
                <button className="UpLoad-close" onClick={onClose}>X</button>
                <div className="UpLoad-area" onClick={() => fileInputRef.current.click()}>
                    <IoIosCloudUpload size={50} /> {/* Icon */}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileSelection} 
                        multiple 
                        style={{ display: 'none' }} // Hide the input - must do it like this to only be able to click the icon for uploading 
                    />
                    {/* <p>Upload Files</p> */}
                </div>
                
                <div className="file-list-container">
                    {Array.from(files).map((file, index) => (
                        <div key={index} className="file-item">
                            <span className="file-name">{file.name}</span>
                            <div className="file-progress">
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${uploadStatus[file.name]}%`, backgroundColor: uploadStatus[file.name] === 100 ? 'purple' : '' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="UpLoad-clear" onClick={clearFiles}>Clear</button>
                <button className="UpLoad" onClick={uploadFiles}>Upload</button>
            </div>
        </div>
    );
};

export default UpLoad;
