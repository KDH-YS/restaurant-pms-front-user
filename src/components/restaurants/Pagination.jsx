import React from 'react';
import { Pagination } from 'react-bootstrap';
import '../../css/restaurants/pagination.css';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 범위 계산 (최대 10개 페이지 버튼을 보여주기 위한 함수)
  const calculatePageRange = (currentPage, totalPages) => {
    const pagesToShow = 10;  // 최대 10개까지 페이지를 보이게 한다
    const leftRange = 4; // 왼쪽 4 페이지
    const rightRange = 5; // 오른쪽 5 페이지
    let startPage = currentPage - leftRange; // 시작은 현재에서 왼쪽 4
    let endPage = currentPage + rightRange; // 끝은 현재에서 오른쪽 5

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

  // 페이지 범위 계산
  const [startPage, endPage] = calculatePageRange(currentPage, totalPages);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 페이지네이션이 한 페이지일 때는 비활성화
  if (totalPages <= 1) {
    return null; // 페이지네이션이 필요 없으면 null 반환
  }

  return (
    <Pagination className="d-flex justify-content-center mt-4 mb-4">
      {/* 첫 페이지 버튼 */}
      <Pagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      
      {/* 이전 페이지 버튼 */}
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
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

      {/* 다음 페이지 버튼 */}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      
      {/* 마지막 페이지 버튼 */}
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default PaginationComponent;
