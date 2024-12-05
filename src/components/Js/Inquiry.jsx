import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Pagination } from "react-bootstrap";
import "../../css/inquiry.css";

export function Inquiry() {
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      title: "최신 문의사항",
      author: "홍길동",
      date: "2024.12.24",
      content: "문의사항의 내용입니다.",
    },
    {
      id: 2,
      title: "질문",
      author: "이순신",
      date: "2024.12.23",
      content: "질문 내용이 여기에 나옵니다.",
    },
  ]);

  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [showNewInquiryForm, setShowNewInquiryForm] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ title: "", content: "" });

  const handleSearch = (event) => {
    event.preventDefault();
    alert("검색 기능은 현재 구현되지 않았습니다.");
  };

  const handleSelectInquiry = (inquiryId) => {
    if (selectedInquiryId === inquiryId) {
      setSelectedInquiryId(null);
    } else {
      setSelectedInquiryId(inquiryId);
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

  const handleNewInquirySubmit = (event) => {
    event.preventDefault();
    if (newInquiry.title.trim() && newInquiry.content.trim()) {
      setInquiries([
        ...inquiries,
        {
          id: inquiries.length + 1,
          title: newInquiry.title,
          date: new Date().toISOString().split("T")[0],
          content: newInquiry.content,
        },
      ]);
      setNewInquiry({ title: "", content: "" });
      setShowNewInquiryForm(false);
    } else {
      alert("모든 필드를 작성해주세요.");
    }
  };

  return (
    <Container className="js-inquiry-container mt-4">
      {/* Header Section */}
      <Row className="js-header align-items-center mb-3 p-3 rounded">
        <Col>
          <h3 className="fw-bold">문의사항</h3>
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

      {/* Inquiry Table Section */}
      <div className="js-inquiry-table mb-4">
        {inquiries.map((inquiry) => (
          <React.Fragment key={inquiry.id}>
            <div
              className="js-inquiry-row d-flex justify-content-between align-items-center rounded p-3 mb-2"
              onClick={() => handleSelectInquiry(inquiry.id)}
              style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
            >
              <div className="js-inquiry-title">
                <strong>{inquiry.title}</strong>
              </div>
              <div className="js-inquiry-meta d-flex">
                <div className="js-inquiry-date text-end" style={{ minWidth: "100px" }}>
                  {inquiry.date}
                </div>
              </div>
            </div>
            {selectedInquiryId === inquiry.id && (
              <div className="js-inquiry-detail rounded p-4 mt-3">
                <Card className="js-inquiry-card rounded border-0">
                  <Card.Body>
                    <Card.Text className="js-inquiry-content mb-4">{inquiry.content}</Card.Text>
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
                        <Button
                          variant="secondary"
                          onClick={handleToggleReplyForm}
                        >
                          답글 작성
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            className="me-2"
                            onClick={handleToggleReplyForm}
                          >
                            답글 취소
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleReplySubmit}
                          >
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
        <Button
          variant="primary"
          onClick={() => setShowNewInquiryForm(true)}
        >
          글쓰기
        </Button>
      </div>

      {/* New Inquiry Form */}
      {showNewInquiryForm && (
        <Card className="js-new-inquiry-form mb-4 p-4 border-0 rounded">
          <Card.Body>
            <Form onSubmit={handleNewInquirySubmit}>
              <Form.Group controlId="newInquiryTitle" className="mb-3">
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type="text"
                  value={newInquiry.title}
                  onChange={(e) => setNewInquiry({ ...newInquiry, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                />
              </Form.Group>
              <Form.Group controlId="newInquiryContent" className="mb-3">
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={newInquiry.content}
                  onChange={(e) => setNewInquiry({ ...newInquiry, content: e.target.value })}
                  placeholder="내용을 입력하세요"
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowNewInquiryForm(false)}>
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
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePaginationClick(page)}
              >
                {page}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default Inquiry;
