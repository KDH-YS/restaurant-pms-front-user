import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Pagination } from "react-bootstrap";
import "../../css/inquiry.css";

export function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewNoticeForm, setShowNewNoticeForm] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });

  useEffect(() => {
    // API 호출을 위해 fetch 사용
    const fetchNotices = async () => {
      const requestData = {
        bbsId: "BBSMSTR_AAAAAAAAAAAA",
        pageIndex: "1",
        searchCnd: "0",
        searchWrd: ""
      };

      try {
        // GET 요청을 위한 URL 및 쿼리 파라미터 추가
        const response = await fetch("http://13.124.43.252/board?" + new URLSearchParams(requestData), {
          method: 'GET',
        });
        
        const data = await response.json();
        
        // 응답 코드가 200일 경우 공지사항 데이터 업데이트
        if (data.resultCode === 200) {
          setNotices(data.result.resultList);
        } else {
          console.error("Failed to load notices:", data.resultMessage);
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    // 데이터 가져오기
    fetchNotices();
  }, []);

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
          <React.Fragment key={notice.id}>
            <div
              className="js-notice-row d-flex justify-content-between align-items-center rounded p-3 mb-2"
              onClick={() => handleSelectNotice(notice.id)}
              style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
            >
              <div className="js-notice-title">
                <strong>{notice.title}</strong>
              </div>
              <div className="js-notice-meta d-flex">
                <div className="js-notice-date text-end" style={{ minWidth: "100px" }}>
                  {notice.date}
                </div>
              </div>
            </div>
            {selectedNoticeId === notice.id && (
              <div className="js-notice-detail rounded p-4 mt-3">
                <Card className="js-notice-card rounded border-0">
                  <Card.Body>
                    <Card.Text className="js-notice-content mb-4">{notice.content}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-end text-muted">
                    {showReplyForm && (
                      <Form.Group controlId="replyTextarea" className="js-reply-form mb-4">
                        <Form.Label>답글 작성</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="답글을 작성해주세요."
                        />
                      </Form.Group>
                    )}
                    <div className="js-reply-buttons d-flex justify-content-end">
                      {!showReplyForm ? (
                        <Button variant="secondary" onClick={handleToggleReplyForm}>
                          답글 작성
                        </Button>
                      ) : (
                        <>
                          <Button variant="secondary" className="me-2" onClick={handleToggleReplyForm}>
                            답글 취소
                          </Button>
                          <Button variant="primary" onClick={handleReplySubmit}>
                            답글 등록
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="js-write-button d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={() => setShowNewNoticeForm(true)}>
          글쓰기
        </Button>
      </div>

      {/* New Notice Form */}
      {showNewNoticeForm && (
        <Card className="js-new-notice-form mb-4 p-4 border-0 rounded">
          <Card.Body>
            <Form onSubmit={handleNewNoticeSubmit}>
              <Form.Group controlId="newNoticeTitle" className="mb-3">
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                />
              </Form.Group>
              <Form.Group controlId="newNoticeContent" className="mb-3">
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="내용을 입력하세요"
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowNewNoticeForm(false)}>
                  취소
                </Button>
                <Button type="submit" variant="primary">
                  작성
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Pagination Section */}
      <Row className="js-pagination justify-content-center mt-4">
        <Col md="auto">
          <Pagination>
            {[1, 2, 3, 4, 5].map((page) => (
              <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePaginationClick(page)}>
                {page}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default NoticeBoard;
