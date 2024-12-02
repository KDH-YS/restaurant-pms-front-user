import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import "../../css/main.css";
import "../../css/shopReview.css";

export function ShopReview() {
  const [restaurantId] = useState(1); // 미리 지정된 restaurantId
  const [reviews, setReviews] = useState([]); // 리뷰 상태
  const [reviewImages, setReviewImages] = useState({}); // 리뷰 이미지 상태 (리뷰 ID를 키로)
  const [restaurant, setRestaurant] = useState({}); // 가게 정보 상태
  const [restaurantImg, setRestaurantImg] = useState([]); // 가게 이미지 상태
  const [showMoreReviews, setShowMoreReviews] = useState(false); // 더보기 상태

  // 가게 정보를 가져오는 함수
  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant); // 받은 데이터에서 가게 정보만 설정
        setRestaurantImg(data.restaurantImg); // 받은 데이터에서 가게 이미지 정보 설정
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 리뷰와 이미지 데이터를 가져오는 함수
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews); // 리뷰 데이터를 상태에 저장
        setReviewImages(data.reviewImages); // 리뷰 이미지 데이터를 상태에 저장
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 가게 정보와 리뷰 데이터를 가져옴
  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, [restaurantId]);

  // 더보기 버튼 클릭 시 추가 리뷰 불러오기
  const handleShowMoreReviews = () => {
    setShowMoreReviews(!showMoreReviews);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        {/* 가게 정보 섹션 */}
        <Col md={4} className="text-center">
          <div className="js_shop_info">
            {/* 가게 이미지 동적으로 최대 2개만 표시 */}
            {restaurantImg.length > 0 ? (
              restaurantImg.slice(0, 2).map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl || "https://via.placeholder.com/648x400"}
                  alt={`가게 이미지 ${index + 1}`}
                  className="img-fluid mb-3"
                />
              ))
            ) : (
              <p>가게 이미지가 없습니다.</p>
            )}
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            <p>{restaurant.foodType}</p>
          </div>
        </Col>

        {/* 리뷰 섹션 */}
        <Col md={8}>
          {/* 사진/영상 리뷰 섹션 */}
          <div className="js_photo_review mb-4">
            <h3>사진/영상 리뷰</h3>
            {reviews.length > 0 ? (
              reviews.slice(0, showMoreReviews ? reviews.length : 4).map((review, index) => (
                <div key={index} className="mb-3">
                  <img
                    src={reviewImages[review.reviewId]?.[0]?.imageUrl || "https://via.placeholder.com/324x324"}
                    alt={`사진 리뷰 ${index + 1}`}
                    className="img-fluid"
                  />
                </div>
              ))
            ) : (
              <p>사진 리뷰가 없습니다.</p>
            )}
            <Button
              variant="primary"
              size="lg"
              block
              onClick={handleShowMoreReviews}
            >
              {showMoreReviews ? "줄이기" : "더보기"}
            </Button>
          </div>

          {/* 리뷰 리스트 */}
          <h3>리뷰</h3>
          <ListGroup>
            {reviews.length > 0 ? (
              reviews.slice(0, showMoreReviews ? reviews.length : 3).map((review) => (
                <ListGroup.Item key={review.reviewId}>
                  <Row>
                    <Col md={2} className="text-center">
                      <img
                        src={review.imageUrl || "https://via.placeholder.com/100x100"}
                        alt="음식 이미지"
                        className="img-fluid rounded-circle"
                      />
                    </Col>
                    <Col md={10}>
                      <p><strong>{review.reviewerName}</strong></p>
                      <p>{review.reviewContent}</p>
                      <Button variant="link">더보기</Button>
                      <p className="text-muted">
                        {review.reviewDate} {review.visitOrder} 영수증
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </ListGroup>
          <Button
            variant="primary"
            size="lg"
            block
            onClick={handleShowMoreReviews}
            className="mt-3"
          >
            {showMoreReviews ? "줄이기" : "더보기"}
          </Button>
        </Col>
      </Row>

      {/* SNS 리뷰 섹션 */}
      <Row className="mt-4">
        <Col>
          <div className="js_sns_review">
            <h3>SNS</h3>
            <p>참고할만한 리뷰들</p>
            <Row>
              {[...Array(5)].map((_, index) => (
                <Col md={2} key={index} className="mb-3">
                  <img
                    src="https://via.placeholder.com/220x220"
                    alt={`SNS 이미지 ${index + 1}`}
                    className="img-fluid"
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ShopReview;
