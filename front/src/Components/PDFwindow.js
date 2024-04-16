import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';


const pdfWindow = ({pdf, title}) =>{

    const openPdf = () => {
        window.open(pdf);
      };
    
      return (
        <div style={{ border: '1px solid #ccc', padding: '20px', cursor: 'pointer' }} onClick={openPdf}>
          <h3>{title}</h3>
          <p>Click to view the document</p>
        </div>
      );
    };


export default pdfWindow;