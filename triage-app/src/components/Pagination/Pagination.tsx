import React from 'react';

interface PaginationProps {
    patientsPerPage: number;
    length: number;
    currentPage: number ;
    onPageChange: (pageNumber: number) => void; 
}

const Pagination: React.FC<PaginationProps> = ({ patientsPerPage, length, currentPage, onPageChange }) => {
    const paginationNumbers: number[] = [1,2,3,4,5,6,7,8,9,10];

    if(length > 150) {
        for (let i = 11; i <= Math.ceil(length / patientsPerPage); i++) {
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
