import React from 'react';
import './PDFModal.css'; // Import CSS for PDF modal styling

const PDFModal = ({ id, recipeName }) => {
    return (
        <div id={`pdf-modal-${id}`} className="pdf-modal">
            <div className="pdf-content">
                <span className="close-btn">&times;</span>
                <h2>{recipeName}</h2>
                <object data={`http://localhost:5002/api/recipe/getrecipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`} type="application/pdf">
                    <p>Sorry, your browser doesn't support embedded PDFs.</p>
                </object>
            </div>
        </div>
    );
};

export default PDFModal;
