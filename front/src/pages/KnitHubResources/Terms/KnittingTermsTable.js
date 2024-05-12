import React, { useState, useEffect } from 'react';
import { TextField, TablePagination } from '@mui/material';
import {knittingTerms} from './Terms';


/**
 * Sets up a table with all the terms 
 */
function KnittingTermsTable() {
    // State variables
    const [searchText, setSearchText] = useState('');
    const [filteredTerms, setFilteredTerms] = useState(knittingTerms);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter the knitting terms based on the search text
    useEffect(() => {
        const filtered = knittingTerms.filter(term =>
            term.english.toLowerCase().includes(searchText.toLowerCase()) ||
            term.abbreviation.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTerms(filtered);
    }, [searchText]);

    // Change page 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Change rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            {/* Searching fild */}
            <TextField
                label="Search Terms"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ margin: '20px 0' }}
            />
            {/* Table of knitting terms */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Abbreviation</th>
                        <th>Definition</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTerms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((term, index) => (
                        <tr key={index}>
                            <td>{term.abbreviation}</td>
                            <td>{term.english}</td>
                        </tr>
                    ))}
                </tbody>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 50]}
                    component="div"
                    count={filteredTerms.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </table>
        </div>
    );
}

export default KnittingTermsTable;
