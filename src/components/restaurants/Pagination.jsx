// src/components/Pagination.js

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 현재 페이지와 총 페이지 수를 받아서 페이지 버튼을 렌더링하는 함수
  const calculatePageRange = (currentPage, totalPages) => {
    const pagesToShow = 10;  // 최대 10개까지 페이지를 보이게 한다
    const leftRange = 4; //왼 4
    const rightRange = 5; //오른 5  
    let startPage = currentPage - leftRange; //시작은 현재 왼쪽 4
    let endPage = currentPage + rightRange; //끝은 현재 오른쪽 5

    if (startPage <= 0) {
      startPage = 1;
      endPage = Math.min(pagesToShow, totalPages);
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - pagesToShow + 1);
    }

    return [startPage, endPage];
  };

  const [startPage, endPage] = calculatePageRange(currentPage, totalPages);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>&laquo;</button>
      </li>

      {pageNumbers.map((pageNumber) => (
        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(pageNumber)}>{pageNumber}</button>
        </li>
      ))}

      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>&raquo;</button>
      </li>
    </ul>
  );
};

export default Pagination;
