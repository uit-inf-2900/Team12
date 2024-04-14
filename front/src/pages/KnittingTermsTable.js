import React, { useState, useEffect } from 'react';
import { TextField, TablePagination } from '@mui/material';
import {knittingTerms} from './Terms';



function KnittingTermsTable() {
    const [searchText, setSearchText] = useState('');
    const [filteredTerms, setFilteredTerms] = useState(knittingTerms);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);



    useEffect(() => {
        const filtered = knittingTerms.filter(term =>
            term.english.toLowerCase().includes(searchText.toLowerCase()) ||
            term.norwegian.toLowerCase().includes(searchText.toLowerCase()) ||
            term.abbreviation.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTerms(filtered);
    }, [searchText]);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };

    return (
        <div>
            <TextField
                label="Search Terms"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ margin: '20px 0' }}
            />
              <table className="table">
                    <thead>
                        <tr>
                            <th>English Abbreviation</th>
                            <th>English Term</th>
                            <th>Norwegian Term</th>
                        </tr>
                    </thead>
                    <tbody>
                      {filteredTerms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((term, index) => (
                            <tr key={index}>
                                <td>{term.abbreviation}</td>
                                <td>{term.english}</td>
                                <td>{term.norwegian}</td>
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
