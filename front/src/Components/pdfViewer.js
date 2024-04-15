import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import "../GlobalStyles/pdf.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
  };

const PDF = () => {
    const [file, setFile] = useState('./sample.pdf');
    const [numPages, setNumPages] = useState(null);
    const [width, setWidth] = useState(1200);

    function onFileChange(event) {
        setFile(event.target.files[0]);
    }

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    return (
        
        <div className="resume-section">
            <div className="resume">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options} className="d-flex justify-content-center">
                {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={width > 786 ? 1.7 : 0.6}/>
                ))}
            </Document>
            </div>
        </div>
        
    );
};

export default PDF;
