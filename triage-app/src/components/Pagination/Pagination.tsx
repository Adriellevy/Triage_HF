import React from 'react';

interface PaginationProps {
    patientsPerPage: number;
    length: number;
    currentPage: number ;
    onPageChange: (pageNumber: number) => void; 
}

const Pagination: React.FC<PaginationProps> = ({ patientsPerPage, length, currentPage, onPageChange }) => {
    const paginationNumbers: number[] = [1];

    if(length >= 20) {
        for (let i = 2; i <= Math.ceil(length / patientsPerPage); i++) {
            paginationNumbers.push(i);
        }
    }

    return (
        <div className=' mt-5'>
            {paginationNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={currentPage === pageNumber ? 'bg-blue-800 text-white py-1.5 px-3 rounded-lg' : 'py-1.5 px-3 rounded-lg bg-gray-100'}
                    onClick={() => onPageChange(pageNumber)} 
                >
                    {pageNumber}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
