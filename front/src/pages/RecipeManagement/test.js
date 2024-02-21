// FileUploadModal.js
import React, { useState, useRef } from 'react';
import './FileUploadModal.css'; 
import { IoIosCloudUpload } from "react-icons/io"; // Icon for the upload button

const FileUploadModal = ({ onClose }) => {
    const [fileList, setFileList] = useState([]); // Stores the list of files to be uploaded
    const [uploadStatus, setUploadStatus] = useState({}); // Tracks the upload progress of each file
    const fileInputRef = useRef(null); // Reference to the hidden file input element

    // Handles the selection of files and sets up initial upload progress
    const handleFileSelection = (event) => {
        const selectedFiles = event.target.files;
        const fileStatuses = {};
        Array.from(selectedFiles).forEach(file => {
            fileStatuses[file.name] = { progress: 0, complete: false }; // Initial progress is 0
        });
        setUploadStatus(fileStatuses);
        setFileList(selectedFiles);
    };

    // Placeholder function for handling the upload process
    const handleUpload = () => {
        // TODO: Implement the file upload logic here
    };

    // Clears the selected files and resets the upload status
    const clearSelectedFiles = () => {
        setFileList([]);
        setUploadStatus({});
    };

    return (
        <div className="file-upload-backdrop">
            <div className="file-upload-modal">
                <button className="close-button" onClick={onClose}>X</button>
                <div className="upload-icon" onClick={() => fileInputRef.current.click()}>
                    <IoIosCloudUpload size={50} />
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileSelection} 
                        multiple 
                        className="file-input" // Hide this input and trigger it by clicking the icon
                    />
                </div>

                <div className="file-list">
                    {Array.from(fileList).map((file, index) => (
                        <div key={index} className="file-item">
                            <span className="file-name">{file.name}</span>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${uploadStatus[file.name].progress}%`, backgroundColor: uploadStatus[file.name].complete ? 'purple' : '' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="action-buttons">
                    <button className="clear-button" onClick={clearSelectedFiles}>Clear</button>
                    <button className="upload-button" onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
