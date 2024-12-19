import React from 'react';
import { Pagination } from 'react-bootstrap';
import '../../css/restaurants/pagination.css';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const pagesPerRange = 10;  // 한 페이지 범위에 보여줄 페이지 수
  const currentRangeStart = Math.floor((currentPage - 1) / pagesPerRange) * pagesPerRange + 1; // 현재 페이지의 시작 범위
  const currentRangeEnd = Math.min(currentRangeStart + pagesPerRange - 1, totalPages); // 현재 페이지의 끝 범위

  // 페이지 번호 생성
  const pageNumbers = [];
  for (let i = currentRangeStart; i <= currentRangeEnd; i++) {
    pageNumbers.push(i);
  }

  // 페이지네이션이 한 페이지일 때는 비활성화
  if (totalPages <= 1) {
    return null; // 페이지네이션이 필요 없으면 null 반환
  }

  const handlePrevRange = () => {
    if (currentRangeStart > 1) {
      onPageChange(currentRangeStart - pagesPerRange);
    }
  };

  const handleNextRange = () => {
    if (currentRangeEnd < totalPages) {
      onPageChange(currentRangeStart + pagesPerRange);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1); // 첫 페이지로 이동
  };

  const handleLastPage = () => {
    onPageChange(totalPages); // 마지막 페이지로 이동
  };

  return (
    <Pagination className="d-flex justify-content-center mt-4 mb-4">
      {/* 첫 페이지 버튼 */}
      <Pagination.First
        onClick={handleFirstPage}
        disabled={currentPage === 1}
      />
      
      {/* 이전 10개 버튼 */}
      <Pagination.Prev
        onClick={handlePrevRange}
        disabled={currentRangeStart === 1}
      />

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((pageNumber) => (
        <Pagination.Item
          key={pageNumber}
          active={currentPage === pageNumber}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Pagination.Item>
      ))}

      {/* 다음 10개 버튼 */}
      <Pagination.Next
        onClick={handleNextRange}
        disabled={currentRangeEnd === totalPages}
      />
      
      {/* 마지막 페이지 버튼 */}
      <Pagination.Last
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default PaginationComponent;
