import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import "../../css/main.css";
import "../../css/myreview.css";

export function MyReview() {
  const [reviews, setReviews] = useState([]); // 내 리뷰 상태
  const [reviewImg, setReviewImg] = useState([]); // 리뷰 이미지 상태
  const [user, setUser] = useState({}); // 유저정보 상태
  const [reviewsToShow, setReviewsToShow] = useState(2); // 표시할 리뷰 수 상태

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
        setReviews(data.reviews); // 리뷰 데이터 설정
        setReviewImg(data.reviewImages); // 리뷰 이미지 설정
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 유저정보와 내 리뷰 데이터를 가져옴
  useEffect(() => {
    fetchUser();
    fetchMyReviews();
  }, []);

  // 더보기 버튼 클릭 시 추가 리뷰 불러오기
  const handleShowMoreReviews = () => {
    setReviewsToShow(reviewsToShow + 2); // 2개씩 추가로 불러오기
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={4}>
          <div className="js_user_info text-center">
            <img
              src={user.profileImageUrl || "https://via.placeholder.com/100x100"}
              alt="User Profile"
              className="img-fluid rounded-circle"
            />
            <p>{user.name}</p>
          </div>
        </Col>
        <Col md={8}>
          <h3>내 리뷰</h3>
          <ListGroup>
            {/* 리뷰 목록을 조건에 맞게 보여줌 */}
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.slice(0, reviewsToShow).map((review) => {
                const image = reviewImg.find((img) => img.reviewId === review.reviewId);
                return (
                  <ListGroup.Item key={review.reviewId} className="d-flex align-items-center">
                    <div className="review-img-container me-3">
                      <img
                        src={image ? image.imageUrl : "https://via.placeholder.com/300x360"}
                        alt={review.restaurantName}
                        className="img-fluid"
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                      />
                    </div>
                    <div>
                      <p>{review.reviewContent}</p>
                      <p><strong>{review.restaurantName}</strong></p>
                      <p>{review.restaurantAddress}</p>
                    </div>
                  </ListGroup.Item>
                );
              })
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </ListGroup>

          {/* 더보기 버튼 */}
          {reviews.length > reviewsToShow && (
            <Button
              variant="primary"
              size="lg"
              block
              onClick={handleShowMoreReviews}
              className="mt-3"
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
