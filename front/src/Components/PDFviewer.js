import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import "../GlobalStyles/pdf.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();


const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
};

const PDFViewer = ({ id, onClose }) => {

    const [pdf, setPDF] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    


    


    const fetchPDF= async () => {
        try{
            const response = await axios.get(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`, {
            responseType: 'arraybuffer' // Ensure response is treated as binary data
        }); 
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        
        } catch(error){
            console.error('Error fetching PDF:', error);
        }
        
        
        
    }
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setCurrentPage(1); // Reset to first page when a new document is loaded
    }

    const goToPrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    
    
    

    return(

    <div className="resume-section">
        <div className="pdf-viewer">
            <div className="document-container">
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={currentPage} />
            </Document>
                
            </div>
        </div>
    </div>

    );


};

export default PDFViewer;
