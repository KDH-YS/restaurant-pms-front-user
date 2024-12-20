import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 한 그룹당 페이지 수
  const pagesPerGroup = 5;
  
  // 현재 페이지가 속한 그룹 계산
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  
  // 현재 그룹의 시작 페이지와 끝 페이지 계산
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  // 페이지 클릭 핸들러
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // 그룹 이동 핸들러 (이전/다음)
  const handleGroupMove = (direction) => {
    const newPage = direction === 'prev' 
      ? Math.max(1, startPage - pagesPerGroup)
      : Math.min(totalPages, endPage + 1);
    onPageChange(newPage);
  };

  // 페이지 아이템 렌더링 함수
  const renderPageItems = () => {
    const pageItems = [];

    // 현재 그룹의 페이지 번호들을 렌더링
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  return (
    <Pagination>
      {/* 첫 페이지로 이동 버튼 */}
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => handlePageClick(1)}
      />
      
      {/* 이전 그룹으로 이동 버튼 */}
      <Pagination.Prev
        disabled={currentGroup === 1}
        onClick={() => handleGroupMove('prev')}
      />
      
      {/* 페이지 번호 버튼들 */}
      {renderPageItems()}
      
      {/* 다음 그룹으로 이동 버튼 */}
      <Pagination.Next
        disabled={currentGroup === Math.ceil(totalPages / pagesPerGroup)}
        onClick={() => handleGroupMove('next')}
      />
      
      {/* 마지막 페이지로 이동 버튼 */}
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(totalPages)}
      />
    </Pagination>
  );
};

export default PaginationComponent;

