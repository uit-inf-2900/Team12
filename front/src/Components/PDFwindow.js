import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PDFViewer = ({ id }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPDF();
    }, [id]);

    const fetchPDF = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5002/api/recipe/getrecipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`, {
                responseType: 'arraybuffer' // Ensure response is treated as binary data
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow) {
                newWindow.opener = null; // Prevent new window from accessing the parent window
            }
        } catch (error) {
            console.error('Error fetching PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pdf-viewer">
            {loading && <p>Loading PDF...</p>}
        </div>
    );
};

export default PDFViewer;
