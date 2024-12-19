import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, ListGroup, Modal, Badge } from "react-bootstrap";
import "../../css/main.css";
import "../../css/myreview.css";
import { useAuthStore } from "store/authStore";
import { jwtDecode } from "jwt-decode";

export function MyReview() {
  const [reviews, setReviews] = useState([]);
  const [reviewImg, setReviewImg] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // 수정 중인 리뷰 ID
  const [editedContent, setEditedContent] = useState(""); // 수정 중인 내용
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [user, setUser] = useState({});
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const { token,userId } = useAuthStore();
  const [restaurant, setRestaurant] = useState([]);
  // 신고
  const [reports, setReports] = useState([]); // 신고된 리뷰 목록
  const [reportToDelete, setReportToDelete] = useState(null);
  const [reportsToShow, setReportsToShow] = useState(2);
  const [showCancleModal, setShowCancleModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null); // textarea 요소 참조

  const [activeTab, setActiveTab] = useState("reviews"); // "reviews" or "reports"

  // 유저정보를 가져오는 API 요청
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/js/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰을 추가
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("유저 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("유저 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 내 리뷰를 가져오는 API
  const fetchMyReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/mypage/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰을 추가
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setReviewImg(data.reviewImages);
        setRestaurant(data.restaurants);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setReviews((prev) =>
          prev.filter((review) => review.reviewId !== reviewToDelete)
        );
        setShowDeleteModal(false);
        console.log("리뷰 삭제 성공");
      } else {
        console.error("리뷰 삭제 실패");
      }
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
    }
  };

  // 리뷰 수정 API 호출
  const handleEditSubmit = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reviewContent: editedContent,
          }),
        }
      );
      if (response.ok) {
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewId === reviewId
              ? { ...review, reviewContent: editedContent }
              : review
          )
        );
        setIsEditing(null); // 수정 모드 종료
        setEditedContent("");
      } else {
        console.error("리뷰 수정 실패");
      }
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error);
    }
  };

  // 내 신고 리뷰를 가져오는 API
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/js/reports/mypage/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error("신고 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmCancle = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reports/${reportToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setReports((prevReports) =>
          prevReports.filter((report) => report.reportId !== reportToDelete)
        );
        setShowDeleteModal(false);
      } else {
        console.error("신고 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 삭제 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    if (activeTab === "reviews") {
      fetchMyReviews();
    } else if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]); // activeTab 변경 시 리뷰 또는 신고 목록 가져오기

  const handleShowMoreReviews = () => {
    setReviewsToShow(reviewsToShow + 2);
  };

  const handleShowMoreReports = () => {
    setReportsToShow(reportsToShow + 2);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };
  // textarea 높이를 동적으로 조정
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 기존 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용 높이 반영
    }
  };
  // 수정 버튼 클릭 시 호출
  const handleEditClick = (review) => {
    setIsEditing(review.reviewId);
    setEditedContent(review.reviewContent);
    setTimeout(adjustTextareaHeight, 0); // 다음 렌더링 주기에서 높이를 설정
  };
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 기존 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용 높이 반영
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };
  const reasonToKorean = (reason) => {
    switch (reason) {
      case "INAPPROPRIATE":
        return "부적절한 내용";
      case "FAKE":
        return "허위 정보";
      case "OFFENSIVE":
        return "모욕적인 내용";
      case "OTHER":
        return "기타";
      default:
        return "알 수 없음";
    }
  };

  const statusToKorean = (status) => {
    switch (status) {
      case "PENDING":
        return "대기 중";
      case "PROCESSED":
        return "처리 완료";
      case "REJECTED":
        return "거부됨";
      default:
        return "알 수 없음";
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-center">
        <Col md={8} className="text-center">
          <div className="js-user-info">
            <img
              src="/img/restaurant_icon.png"
              alt="User Profile"
              className="img-fluid rounded-circle js-user-profile-img"
            />
            <h2 className="js-user-name">{user.name}</h2>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <Row className="mb-4">
            <Col md={12} className="d-flex align-items-center gap-4">
              <h3
                className={`js-section-title ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                내 리뷰
              </h3>
              <h3
                className={`js-section-title ${
                  activeTab === "reports" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reports")}
              >
                내 신고
              </h3>
            </Col>
          </Row>
          {/* 리뷰 목록 렌더링 */}
          {activeTab === "reviews" && (
            <ListGroup className="js-review-list">
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.slice(0, reviewsToShow).map((review) => {
                  const images = reviewImg.filter(
                    (img) => img.reviewId === review.reviewId
                  );
                  return (
                    <ListGroup.Item
                      key={review.reviewId}
                      className="js-review-item mb-3"
                    >
                      <Row className="align-items-center">
                        <img
                          src="/img/restaurant_icon.png"
                          alt="리뷰 프로필 이미지"
                          className="img-fluid rounded-circle mb-0"
                        />
                        <Col xs={8} className="d-flex flex-column">
                          <p className="text-muted small mb-0">
                            {restaurant[0]?.foodType}
                          </p>
                          <p className="mb-0 fw-bold">{restaurant[0]?.name}</p>
                        </Col>
                        {/* 여러 이미지 렌더링 */}
                        {images.length > 0 && (
                          <div className="mt-4 d-flex flex-wrap gap-2">
                            {images.map((image, index) => (
                              <img
                                key={index}
                                src={image.imageUrl}
                                alt={`리뷰 이미지 ${index + 1}`}
                                className="img-fluid rounded js-review-image"
                              />
                            ))}
                          </div>
                        )}
                        {/* 리뷰 내용 */}
                        <Col md={8} xs={9}>
                          {isEditing === review.reviewId ? (
                            // 수정 중일 때 textarea 표시
                            <textarea
                              ref={textareaRef} // 참조 추가
                              className="form-control js-review-textarea mt-4"
                              value={editedContent}
                              onChange={(e) => {
                                setEditedContent(e.target.value);
                                adjustTextareaHeight(); // 내용 변경 시 높이 조정
                              }}
                              onInput={adjustTextareaHeight} // 입력 시 높이 조정
                            />
                          ) : (
                            // 수정 중이 아닐 때 기존 내용 표시
                            <>
                              <p className="js-review-content mt-4">
                                {review.reviewContent}
                              </p>
                              <p className="text-muted small mb-0">
                                {formatDate(review.createdAt)}
                              </p>
                            </>
                          )}
                        </Col>
                        {/* 버튼 섹션 */}
                        <Col
                          md={4}
                          className="d-flex justify-content-end align-items-end"
                        >
                          {review.userId === userId && (
                            <>
                              {isEditing === review.reviewId ? (
                                <>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() =>
                                      handleEditSubmit(review.reviewId)
                                    }
                                  >
                                    완료
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      setIsEditing(null); // 수정 취소
                                      setEditedContent(""); // 내용 초기화
                                    }}
                                  >
                                    취소
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                      setIsEditing(review.reviewId); // 수정 모드 활성화
                                      setEditedContent(review.reviewContent); // 기존 내용 설정
                                    }}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteClick(review.reviewId)
                                    }
                                  >
                                    삭제
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <p>리뷰가 없습니다.</p>
              )}
            </ListGroup>
          )}

          {/* 신고 목록 렌더링 */}
          {activeTab === "reports" && (
            <ListGroup className="js-review-list">
              {Array.isArray(reports) && reports.length > 0 ? (
                reports.slice(0, reportsToShow).map((report) => {
                  return (
                    <ListGroup.Item
                      key={report.reportId}
                      className="js-review-item mb-3"
                    >
                      <Row className="align-items-center">
                        <img
                          src="/img/restaurant_icon.png"
                          alt="신고자 프로필 이미지"
                          className="img-fluid rounded-circle mb-0"
                          style={{ width: "40px", height: "40px" }}
                        />
                        <Col xs={8} className="d-flex flex-column">
                          <p className="text-muted small mb-0">
                            {restaurant[0]?.foodType}
                          </p>
                          <p className="mb-0 fw-bold">{restaurant[0]?.name}</p>
                        </Col>
                        {/* 뱃지와 취소 버튼 */}
                        <Col xs={3} className="d-flex flex-column align-items-end">
                          {/* 뱃지: 오른쪽 상단 */}
                          <Badge
                            bg={
                              report.status === "PENDING"
                                ? "secondary"
                                : report.status === "PROCESSED"
                                ? "primary"
                                : "warning"
                            }
                          >
                            {statusToKorean(report.status)}
                          </Badge>
                        </Col>
                        {/* 신고 내용 */}
                        <Col md={12}>
                          <p
                            className="js-review-content mt-4"
                          >
                            {report.review_content || "리뷰 내용이 없습니다."}
                          </p>
                        </Col>
                        <Col md={8} style={{ height: "100%" }}>
                          <p className="text-muted small mb-0">
                            {formatDate(report.created_at)}
                          </p>
                          <p className="mt-2">
                            <strong>신고 사유: </strong>
                            {reasonToKorean(report.reason)}
                          </p>
                          <p>
                            <strong>신고 내용: </strong>
                            {report.report_description}
                          </p>
                        </Col>
                        {/* 취소 버튼: 오른쪽 하단 */}
                        <Col xs={4} className="d-flex justify-content-end align-items-end" style={{ height: "100%" }}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setReportToDelete(report.reportId);
                              setShowCancleModal(true);
                            }}
                            className="mt-auto"
                          >
                            취소
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <p>신고된 리뷰가 없습니다.</p>
              )}
            </ListGroup>
          )}

          {/* 더보기 버튼 */}
          {activeTab === "reviews" && reviews.length > reviewsToShow && (
            <Button
              variant="primary"
              size="lg"
              className="js-more-btn mt-3 w-100"
              onClick={handleShowMoreReviews}
            >
              더보기
            </Button>
          )}
          {activeTab === "reports" && Array.isArray(reports) && reports.length > reportsToShow && (
            <Button
              variant="primary"
              size="lg"
              className="js-more-btn mt-3 w-100"
              onClick={handleShowMoreReports}
            >
              더보기
            </Button>
          )}
        </Col>
      </Row>

      {/* 리뷰 삭제 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>리뷰를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            아니요
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            예
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 신고 취소 모달 */}
      <Modal show={showCancleModal} onHide={() => setShowCancleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>신고 취소</Modal.Title>
        </Modal.Header>
        <Modal.Body>신고를 취소하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancleModal(false)}>
            아니요
          </Button>
          <Button variant="danger" onClick={confirmCancle}>
            예
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyReview;