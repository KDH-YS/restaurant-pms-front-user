import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ListGroup, ProgressBar, Modal, Form } from "react-bootstrap";
import "../../css/main.css";
import "../../css/shopReview.css";

export function ShopReview() {
  const [restaurantId] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewImages, setReviewImages] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [restaurantImg, setRestaurantImg] = useState([]);
  const [showReviewsCount, setShowReviewsCount] = useState(3);
  const [showPhotosCount, setShowPhotosCount] = useState(3);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReviewId, setReportReviewId] = useState(null);
  const [reportContent, setReportContent] = useState("");
  const [reportReason, setReportReason] = useState("OTHER");

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.restaurantImg);
        setRestaurant(data.restaurant);
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
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.reviews);
        setReviews(data.reviews);
        setReviewImages(data.reviewImages);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, [restaurantId]);

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
          alert("신고가 성공적으로 접수되었습니다.");
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

  return (
    <Container className="mt-4">
      {/* 가게 정보 섹션 */}
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
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
            <h2 className="fw-bold">{restaurant.name}</h2>
            <p className="js-address">{restaurant.address}</p>
            <p className="js-food-type">{restaurant.foodType}</p>
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
                  src={reviewImages[review.reviewId]?.[0]?.imageUrl || "https://via.placeholder.com/200x200"}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="img-fluid rounded shadow-sm"
                />
              </Col>
            ))}
          </Row>
          <Button variant="primary" onClick={handleShowMorePhotos} className="js-more-btn">
            더보기
          </Button>
        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Row className="js-reviews">
        <Col>
          <h3 className="js-section-title">리뷰</h3>
          <ListGroup>
            {reviews.slice(0, showReviewsCount).map((review) => (
              <ListGroup.Item key={review.reviewId} className="js-review-item">
                <Row>
                  <img
                    src={review.imageUrl || "https://via.placeholder.com/40x40"}
                    alt="리뷰 프로필 이미지"
                    className="img-fluid rounded-circle"
                  />
                  <Col xs={10}>
                    <p className="text-muted small">{review.reviewDate}</p>
                  </Col>
                  <Col>
                    <img
                      src="/icons/siren.png"
                      alt="신고하기"
                      onClick={() => handleReportClick(review.reviewId)}
                      style={{ cursor: "pointer" }}
                    />
                    <img src="/icons/heart-regular.svg" alt="좋아요" />
                  </Col>
                  <Row>
                    <img src={review.imageUrl || "https://via.placeholder.com/40x40"} alt="" />
                    <Col>
                      <p>{review.reviewContent}</p>
                    </Col>
                  </Row>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="primary" onClick={handleShowMoreReviews} className="js-more-btn mt-3">
            더보기
          </Button>
        </Col>
      </Row>

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
