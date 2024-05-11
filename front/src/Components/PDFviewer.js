import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

import "../GlobalStyles/pdf.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the path for the worker file correctly, assuming it's in the public folder
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

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

    useEffect(() => {
        fetchPDF();
    }, [id]);  // Add dependencies here if needed

    const fetchPDF = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`, {
                responseType: 'arraybuffer'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPDF(url);
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setError('Failed to load PDF');
        } finally {
            setLoading(false);
        }
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setCurrentPage(1); // Reset to first page when a new document is loaded
    }

    const goToPrevPage = () => {
        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage < numPages ? currentPage + 1 : numPages);
    };

    if (loading) {
        return <div>Loading PDF...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="resume-section">
            <div className="pdf-viewer">
                <div className="document-container">
                    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                        <Page pageNumber={currentPage} />
                    </Document>
                    {numPages && (
                        <div>
                            <button onClick={goToPrevPage} disabled={currentPage === 1}>Previous</button>
                            <button onClick={goToNextPage} disabled={currentPage === numPages}>Next</button>
                            <p>Page {currentPage} of {numPages}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;