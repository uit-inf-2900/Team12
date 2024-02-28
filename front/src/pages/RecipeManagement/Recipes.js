import React, { useState } from 'react';
import FileUpload from './UpLoad'; 

// File for uplading recepies. When uploaded they will be stored in the backend so you can look at them later 
const Recipes = () => {
    // Add state for uploading recipes
    const [Uploading, setUploading] = useState(false);


    return (
        <div className='page-container'> 
            <h1> Velkommen til Oppskriftssiden! </h1>

            {/* Upload one or several recipes */}
            <button onClick={() => setUploading(true)}>Last opp oppskrift</button>
                {Uploading && <FileUpload onClose={() => setUploading(false)} />}
        </div>
    );
}

export default Recipes;