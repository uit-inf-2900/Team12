import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import "../GlobalStyles/pdf.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import axios from 'axios';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
  };

const PDF = ({id}) => {
    const [file, setFile] = useState();
    const [numPages, setNumPages] = useState(null);
    const [width, setWidth] = useState(1200);
    const [loading, setLoading] = useState(true);

    function onFileChange(event) {
        setFile(event.target.files[0]);
    }

    useEffect(() => {
        fetchRecipe();
    }, []);

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    const fetchRecipe = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`); 
            setFile(response.data); 
        } catch (error) {
            console.error('Error fetching PDF:', error);
        } finally {
            setLoading(false);
        }
    };


    

    

    return (
        
        <div className="resume-section">
            <div className="resume">
            <Document file={file} className="d-flex justify-content-center">
                
            </Document>
            </div>
        </div>
        
    );
};

export default PDF;
