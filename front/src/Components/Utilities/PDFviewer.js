import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import "../../GlobalStyles/main.css"; // Assuming styles are here
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import axios from 'axios';
import PDFwindow from './PDFwindow';
import RateRecipe from '../../pages/RecipeManagement/rating';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ id, onClose, onDelete }) => {
    const [file, setFile] = useState();
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openWindow, setOpenWindow]= useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`, {
                    responseType: 'arraybuffer',
                    cancelToken: new axios.CancelToken((cancel) => {
                        // Cancel the request if the component unmounts
                        return () => cancel("Request cancelled due to component unmount");
                    })
                });
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setFile(url);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request cancelled:", error.message);
                } else {
                    setError('Error fetching PDF: ' + error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        

        fetchData();

        return () => {
            // Clean up by revoking the object URL
            if (file) URL.revokeObjectURL(file);
        };
    }, [id]);

    const handleRecipeDelete = async (recipeId) => {
        try {
            const response = await axios.delete(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${recipeId}`);
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error deleting recipe:', error);
        } finally {
            
        }

        
    };


    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setCurrentPage(1);
    };

    const goToPrevPage = () => {
        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage < numPages ? currentPage + 1 : numPages);
    };

    const handlePDFwindow = () => {
        setOpenWindow(!openWindow);


    };

    if (loading) return <div className="loading-indicator">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (

        
            <div className="resume-section">
                <div className="pdf-viewer">
                <div className='box light' style={{width:'100%'}}>
                    <div className='navigation'>
                        <button onClick={handlePDFwindow}>Open in new page</button>
                        <button onClick={onDelete}> Delete recipe </button> 
                    </div>
                    <div className="document-container" style={{ overflowY: 'scroll', height: '80vh'}}>
                        
                        
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="d-flex justify-content-center"
                        >
                            <Page pageNumber={currentPage} />
                        </Document>
                    </div>
                    <div className="navigation">
                        <button disabled={currentPage <= 1} onClick={goToPrevPage}>Previous</button>
                        <span>Page {currentPage} of {numPages}</span>
                        <button disabled={currentPage >= numPages} onClick={goToNextPage}>Next</button>
                        <button onClick={onClose} className="close-button">Close</button>
                        <RateRecipe id={id} ></RateRecipe>
                    </div>
                    {/* <div className='navigation'>
                        <button> Rate recipe ! </button>
                    </div> */}

                    {openWindow &&(
                        <PDFwindow id={id} onClose={()=> setOpenWindow(false)}>
                        
                        </PDFwindow>
                    )}
                </div>
            </div>
        </div>
        
    );
};

export default PDFViewer;