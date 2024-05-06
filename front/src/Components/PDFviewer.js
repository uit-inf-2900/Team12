import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import "../GlobalStyles/pdf.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ id, onClose }) => {
    const [file, setFile] = useState();
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const options = {
        cMapUrl: 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'standard_fonts/',
    };
    
    useEffect(() => {
        fetchPDF();
        return () => {
            if (file) URL.revokeObjectURL(file); // Clean up URL object
        };
    }, []);

    const fetchPDF = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`, {
                responseType: 'arraybuffer'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setFile(url);
        } catch (error) {
            setError('Error fetching PDF: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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

    const toggleFullScreen = () => {
        const elem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        if (!elem) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!file) return null; // If no file is loaded, don't render anything

    return (
        <div className="resume-section">
            <div className="pdf-viewer">
                <button onClick={onClose} className="close-button">Close</button>
                <button onClick={toggleFullScreen} className="full-view-button">Full View</button>
                <div className="document-container">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="d-flex justify-content-center"
                        options={options}
                    >
                        <Page pageNumber={currentPage} />
                    </Document>
                </div>
                <div className="navigation">
                    <button disabled={currentPage <= 1} onClick={goToPrevPage}>Previous</button>
                    <span>Page {currentPage} of {numPages}</span>
                    <button disabled={currentPage >= numPages} onClick={goToNextPage}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
