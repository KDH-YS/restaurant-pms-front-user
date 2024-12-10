import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ListGroup, ProgressBar, Modal, Form } from "react-bootstrap";
import "../../css/main.css";
import "../../css/shopReview.css";

import { useAuthStore } from "store/authStore";
import { restaurantStore } from 'store/restaurantStore';

export function ShopReview() {
  // api상태관리
  const [reviews, setReviews] = useState([]);
  const [reviewImages, setReviewImages] = useState({});
  const [isEditing, setIsEditing] = useState(null); // 수정 중인 리뷰 ID
  const [editedContent, setEditedContent] = useState(""); // 수정 중인 내용
  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantImg, setRestaurantImg] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reportReviewId, setReportReviewId] = useState(null);
  const [reportContent, setReportContent] = useState("");
  const [reportReason, setReportReason] = useState("OTHER");
  const [helpfulReviews, setHelpfulReviews] = useState({});
  // 주스탠드
  const { restaurant } = restaurantStore();
  const { token } = useAuthStore();
  // 프론트 상태관리
  const [showReviewsCount, setShowReviewsCount] = useState(3);
  const [showPhotosCount, setShowPhotosCount] = useState(3);

  const userId = parseJwt(token)?.userId; // JWT에서 userId 추출

  // JWT 파싱 함수
  function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurant.restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurantData(data.restaurant);
        setRestaurantImg(data.restaurantImg);
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurant.restaurantId}/reviews?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();

        // 리뷰와 좋아요 상태를 함께 포함한 데이터를 가져오기
        const reviewsData = data.reviews.map(reviewData => ({
          ...reviewData.review, // 리뷰 관련 필드
          isHelpful: reviewData.isHelpful // 좋아요 여부 필드 추가
        }));
  
        setReviews(reviewsData);
        setReviewImages(data.reviewImages);
  
        // 좋아요 상태 설정
        const helpfulStatus = {};
        reviewsData.forEach(review => {
          helpfulStatus[review.reviewId] = review.isHelpful; // 서버에서 가져온 좋아요 상태 반영
        });
        setHelpfulReviews(helpfulStatus);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 리뷰 수정 API 호출
  const handleEditSubmit = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewContent: editedContent,
        }),
      });
      if (response.ok) {
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewId === reviewId ? { ...review, reviewContent: editedContent } : review
          )
        );
        setIsEditing(null); // 수정 모드 종료
      } else {
        console.error("리뷰 수정 실패");
      }
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, [restaurant.restaurantId]);

  const handleReportSubmit = async () => {
    if (reportReviewId && reportContent) {
      try {
        const response = await fetch(`http://localhost:8080/api/reviews/${reportReviewId}/report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId: reportReviewId,
            userId: 1,
            reason: reportReason,
            reportDescription: reportContent,
          }),
        });

        if (response.ok) {
          console.log("신고가 성공적으로 접수되었습니다.");
        } else {
          console.error("신고를 접수하는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("신고를 접수하는 중 오류 발생:", error);
      }
    }
    setShowReportModal(false);
    setReportContent("");
    setReportReason("OTHER");
  };

  const handleHelpfulClick = async (reviewId) => {
    const currentStatus = helpfulReviews[reviewId];
    try {
      const url = currentStatus
        ? `http://localhost:8080/api/reviews/${reviewId}/helpful?userId=1`
        : `http://localhost:8080/api/reviews/${reviewId}/helpful`;
      const options = {
        method: currentStatus ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      if (!currentStatus) {
        options.body = JSON.stringify({
          userId: 1,
          state: 1
        });
      }
  
      // 서버 요청 전 UI 상태 업데이트 (로딩 상태 표현)
      setHelpfulReviews((prev) => ({
        ...prev,
        [reviewId]: null,  // null 값으로 설정하여 로딩 중인 상태 표시
      }));
  
      const response = await fetch(url, options);
  
      // 서버 응답이 성공적일 때만 상태를 업데이트
      if (response.ok) {
        setHelpfulReviews((prev) => ({
          ...prev,
          [reviewId]: !currentStatus,
        }));
        console.log(currentStatus ? "도움이 취소되었습니다." : "도움이 되었습니다.");
      } else {
        // 서버 요청 실패 시 원래 상태 복구
        setHelpfulReviews((prev) => ({
          ...prev,
          [reviewId]: currentStatus,
        }));
        console.error("도움이 되었습니다/취소를 처리하는 데 실패했습니다.");
      }
    } catch (error) {
      // 에러 발생 시 원래 상태 복구
      setHelpfulReviews((prev) => ({
        ...prev,
        [reviewId]: currentStatus,
      }));
      console.error("도움이 되었습니다/취소를 처리하는 중 오류 발생:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.reviewId !== reviewToDelete));
        setShowDeleteModal(false);
        console.log("리뷰 삭제 성공");
      } else {
        console.error("리뷰 삭제 실패");
      }
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
    }
  };

  const handleShowMoreReviews = () => {
    setShowReviewsCount(showReviewsCount + 3);
  };

  const handleShowMorePhotos = () => {
    setShowPhotosCount(showPhotosCount + 3);
  };

  const handleReportClick = (reviewId) => {
    setReportReviewId(reviewId);
    setShowReportModal(true);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <Container className="mt-4">
      {/* 가게 정보 섹션 */}
      <Row className="justify-content-center mb-4">
        <Col md={12}>
          <div className="js-shop-info">
            {restaurantImg.length > 0 ? (
              <img
                src={restaurantImg[0].imageUrl || "https://via.placeholder.com/648x400"}
                alt="가게 이미지"
                className="img-fluid mb-3 rounded"
              />
            ) : (
              <p>가게 이미지가 없습니다.</p>
            )}
            <p className="js-food-type">{restaurant.foodType} | {restaurant.neighborhood}</p>
            <h2 className="fw-bold">{restaurant.name}</h2>
            <p className="js-address">{restaurant.address}</p>
          </div>
        </Col>
      </Row>

      {/* 평점 섹션 */}
      <Row className="mb-4">
        <Row md={12} className="text-center js-rating-section">
          <Col md={4} className="js-star-rating">
            <span className="fs-1 text-warning">★</span>
            <span className="fs-3 fw-bold">4.5</span>
          </Col>
          <Col>
            <ProgressBar now={80} label="5점 (100개)" className="mb-2" />
            <ProgressBar now={10} label="4점 (10개)" className="mb-2" />
            <ProgressBar now={5} label="3점 (5개)" className="mb-2" />
            <ProgressBar now={2} label="2점 (2개)" className="mb-2" />
            <ProgressBar now={1} label="1점 (1개)" />
          </Col>
        </Row>
      </Row>

      {/* 사진/영상 리뷰 섹션 */}
      <Row className="mb-4 js-photo-review">
        <Col>
          <h3 className="js-section-title">사진/영상 리뷰</h3>
          <Row>
            {reviews.slice(0, showPhotosCount).map((review, index) => (
              <Col md={4} className="mb-3" key={index}>
                <img
                  src={
                    reviewImages[review.reviewId]?.[0]?.imageUrl ||
                    "https://via.placeholder.com/200x200"
                  }
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="img-fluid rounded shadow-sm"
                />
              </Col>
            ))}
          </Row>
          {/* 사진/영상 리뷰가 더 있으면 더보기 버튼 표시 */}
          {reviews.length > showPhotosCount && (
            <Button variant="primary" onClick={handleShowMorePhotos} className="js-more-btn">
              더보기
            </Button>
          )}
        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Row className="js-reviews">
        <Col>
          <h3 className="js-section-title mb-0">리뷰</h3>
          <ListGroup>
            {reviews.map((review) => (
              <ListGroup.Item key={review.reviewId} className="js-review-item">
                <Row className="align-items-center">
                  <img
                    src={review.imageUrl || "https://via.placeholder.com/40x40"}
                    alt="리뷰 프로필 이미지"
                    className="img-fluid rounded-circle"
                  />
                  <Col xs={8} className="d-flex flex-column">
                    <p className="mb-0 fw-bold">{review.userName}</p>
                    <p className="text-muted small mb-0">{formatDate(review.createdAt)}</p>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-start">
                    <img
                      src="/icons/siren.png"
                      alt="신고하기"
                      onClick={() => handleReportClick(review.reviewId)}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    />
                    <img
                      src={helpfulReviews[review.reviewId] ? "/icons/heart.svg" : "/icons/heart-regular.svg"}
                      alt="좋아요"
                      onClick={() => handleHelpfulClick(review.reviewId)}
                      style={{ cursor: "pointer" }}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    {/* 수정 중인 리뷰일 경우 input box 표시 */}
                    {isEditing === review.reviewId ? (
                      <Form.Control
                        type="textarea"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                    ) : (
                      <p className="mb-0">{review.reviewContent}</p>
                    )}
                  </Col>
                  <Col xs={4} className="d-flex justify-content-end align-items-end">
                    {review.userId === userId && (
                      <>
                        {isEditing === review.reviewId ? (
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditSubmit(review.reviewId)}
                          >
                            완료
                          </Button>
                        ) : (
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
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(review.reviewId)}
                        >
                          삭제
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* 리뷰 삭제 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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

      {/* 신고 작성 모달 */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 신고하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reportReason">
              <Form.Label>신고 이유</Form.Label>
              <Form.Control
                as="select"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="OTHER">기타</option>
                <option value="INAPPROPRIATE">부적절한 내용</option>
                <option value="FAKE">가짜 리뷰</option>
                <option value="OFFENSIVE">모욕적 언어 사용</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="reportContent">
              <Form.Label>신고 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleReportSubmit}>
            신고하기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ShopReview;
