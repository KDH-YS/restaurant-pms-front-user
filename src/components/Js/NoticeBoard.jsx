import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Pagination } from "react-bootstrap";
import axios from 'axios'; // axios 추가
import "../../css/inquiry.css";

export function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewNoticeForm, setShowNewNoticeForm] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [totalPages, setTotalPages] = useState(1);

  // Axios를 사용하여 공지사항을 가져오는 함수
  const fetchNotices = (pageIndex = 1) => {
    axios.get('http://jennysoft.kr:8080/board', {
      params: {
        bbsId: 'BBSMSTR_AAAAAAAAAAAA',
        pageIndex: pageIndex,
        searchCnd: 0,
        searchWrd: ' '
      }
    })
    .then(response => {
      if (response.data.resultCode === 200) {
        const resultList = response.data.result.resultList;
        const totalRecordCount = response.data.result.resultCnt;
        const totalPages = Math.ceil(totalRecordCount / 10); // 페이지 수 계산
        setNotices(resultList);
        setTotalPages(totalPages);
      } else {
        throw new Error('API 응답 오류');
      }
    })
    .catch(error => {
      console.error('API 호출 중 오류 발생:', error);
    });
  };

  // useEffect를 사용하여 컴포넌트가 마운트될 때 공지사항 데이터를 가져옴
  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const handleSearch = (event) => {
    event.preventDefault();
    alert("검색 기능은 현재 구현되지 않았습니다.");
  };

  const handleSelectNotice = (noticeId) => {
    if (selectedNoticeId === noticeId) {
      setSelectedNoticeId(null);
    } else {
      setSelectedNoticeId(noticeId);
      setShowReplyForm(false);
    }
  };

  const handleToggleReplyForm = () => {
    setShowReplyForm((prevShow) => !prevShow);
  };

  const handleReplySubmit = () => {
    alert("답글이 등록되었습니다.");
    setReplyContent("");
    setShowReplyForm(false);
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewNoticeSubmit = (event) => {
    event.preventDefault();
    if (newNotice.title.trim() && newNotice.content.trim()) {
      setNotices([
        ...notices,
        {
          id: notices.length + 1,
          title: newNotice.title,
          date: new Date().toISOString().split("T")[0],
          content: newNotice.content,
        },
      ]);
      setNewNotice({ title: "", content: "" });
      setShowNewNoticeForm(false);
    } else {
      alert("모든 필드를 작성해주세요.");
    }
  };

  return (
    <Container className="js-notice-container mt-4">
      {/* Header Section */}
      <Row className="js-header align-items-center mb-3 p-3 rounded">
        <Col>
          <h3 className="fw-bold">공지사항</h3>
        </Col>
        <Col md={4}>
          <Form onSubmit={handleSearch}>
            <Form.Control type="text" placeholder="검색어를 입력하세요" className="js-search-input" />
          </Form>
        </Col>
        <Col md={1}>
          <Button type="submit" onClick={handleSearch} variant="primary" className="js-search-btn w-100">
            검색
          </Button>
        </Col>
      </Row>

      {/* Notice Table Section */}
      <div className="js-notice-table mb-4">
        {notices.map((notice) => (
          <React.Fragment key={notice.nttId}>
            <div
              className="js-notice-row d-flex justify-content-between align-items-center rounded p-3 mb-2"
              onClick={() => handleSelectNotice(notice.nttId)}
              style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
            >
              <div className="js-notice-title">
                <strong>{notice.nttSj}</strong>
              </div>
              <div className="js-notice-meta d-flex">
                <div className="js-notice-date text-end" style={{ minWidth: "100px" }}>
                  {notice.frstRegisterPnttm}
                </div>
              </div>
            </div>
            {selectedNoticeId === notice.nttId && (
              <div className="js-notice-detail rounded p-4 mt-3">
                <Card className="js-notice-card rounded border-0">
                  <Card.Body>
                    <Card.Text className="js-notice-content mb-4">{notice.nttCn}</Card.Text>
                  </Card.Body>
                </Card>
                <Card.Footer className="text-end text-muted">
                  {showReplyForm && (
                    <Form.Group controlId="replyTextarea" className="js-reply-form">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <Button variant="primary" onClick={handleReplySubmit} className="mt-2">
                        답글 등록
                      </Button>
                    </Form.Group>
                  )}
                </Card.Footer>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="js-pagination d-flex justify-content-center mt-4">
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => handlePaginationClick(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
}
export default NoticeBoard;