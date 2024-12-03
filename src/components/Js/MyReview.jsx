import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import "../../css/main.css";
import "../../css/myreview.css";

export function MyReview() {
  const [reviews, setReviews] = useState([]);
  const [reviewImg, setReviewImg] = useState([]);
  const [user, setUser] = useState({});
  const [reviewsToShow, setReviewsToShow] = useState(2);

  // 유저정보를 가져오는 API 요청
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/js/user/1`);
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
      const response = await fetch(`http://localhost:8080/api/mypage/1/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setReviewImg(data.reviewImages);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMyReviews();
  }, []);

  const handleShowMoreReviews = () => {
    setReviewsToShow(reviewsToShow + 2);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-center">
        <Col md={8} className="text-center">
          <div className="js-user-info">
            <img
              src={user.profileImageUrl || "https://via.placeholder.com/100x100"}
              alt="User Profile"
              className="img-fluid rounded-circle js-user-profile-img"
            />
            <h2 className="js-user-name">{user.name}</h2>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <h3 className="js-section-title">내 리뷰</h3>
          <ListGroup className="js-review-list">
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.slice(0, reviewsToShow).map((review) => {
                const image = reviewImg.find((img) => img.reviewId === review.reviewId);
                return (
                  <ListGroup.Item key={review.reviewId} className="js-review-item mb-3">
                    <Row classNam e="align-items-center">
                      <Col md={2} xs={3} className="text-center">
                        <img
                          src={image ? image.imageUrl : "https://via.placeholder.com/100x100"}
                          alt={review.restaurantName}
                          className="img-fluid rounded js-review-image"
                        />
                      </Col>
                      <Col md={10} xs={9}>
                        <p className="js-review-content">{review.reviewContent}</p>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </ListGroup>
          {reviews.length > reviewsToShow && (
            <Button
              variant="primary"
              size="lg"
              className="js-more-btn mt-3 w-100"
              onClick={handleShowMoreReviews}
            >
              더보기
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MyReview;
