import React, { useEffect, useState } from "react";
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
    <div className="container">
      <div className="content">
        {/* 가게 정보 섹션 */}
        <div className="js_shop_info">
          <>
            {/* 가게 이미지 동적으로 최대 2개만 표시 */}
            {restaurantImg.length > 0 ? (
              restaurantImg.slice(0, 2).map((img, index) => ( // 최대 2개 이미지만 표시
                <img
                  key={index}
                  src={img.imageUrl || "https://via.placeholder.com/648x400"}
                  alt={`가게 이미지 ${index + 1}`}
                />
              ))
            ) : (
              <p>가게 이미지가 없습니다.</p>
            )}
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            <p>{restaurant.foodType}</p>
          </>
        </div>

        {/* 사진/영상 리뷰 섹션 */}
        <div className="js_photo_review">
          <h3>사진/영상 리뷰</h3>
          {/* 동적으로 사진 리뷰 표시 */}
          {reviews.length > 0 ? (
            reviews.slice(0, showMoreReviews ? reviews.length : 4).map((review, index) => (
              <div key={index}>
                <img
                  src={reviewImages[review.reviewId]?.[0]?.imageUrl || "https://via.placeholder.com/324x324"}
                  alt={`사진 리뷰 ${index + 1}`}
                />
              </div>
            ))
          ) : (
            <p>사진 리뷰가 없습니다.</p>
          )}
          <button className="btn btn-lg btn-prima ry" type="button" onClick={handleShowMoreReviews}>
            {showMoreReviews ? "줄이기" : "더보기"}
          </button>
        </div>

        {/* 리뷰 섹션 */}
        <ul className="js_review">
          <h3>리뷰</h3>
          {reviews.length > 0 ? (
            reviews.slice(0, showMoreReviews ? reviews.length : 3).map((review) => (
              <li key={review.reviewId}>
                <div>
                  <p>{review.reviewerName}</p>
                  <img
                    src={review.imageUrl || "https://via.placeholder.com/100x100"}
                    alt="음식 이미지"
                  />
                  <p>{review.reviewContent}</p>
                  <p>더보기</p>
                  <img src="https://via.placeholder.com/40x40" alt="반응 아이콘" />
                  <p>반응 남기기</p>
                  <p>{review.reviewDate} {review.visitOrder} 영수증</p>
                </div>
                <div className="js_line"></div>
              </li>
            ))
          ) : (
            <p>리뷰가 없습니다.</p>
          )}
          <button className="btn btn-lg btn-prima ry" type="button" onClick={handleShowMoreReviews}>
            {showMoreReviews ? "줄이기" : "더보기"}
          </button>
        </ul>

        {/* SNS 리뷰 섹션 */}
        <ul className="js_sns_review">
          <h3>SNS</h3>
          <p>참고할만한 리뷰들</p>
          <li>
            {/* SNS 리뷰 아이콘들 */}
            <img src="https://via.placeholder.com/220x220" alt="SNS 이미지 1" />
            <img src="https://via.placeholder.com/220x220" alt="SNS 이미지 2" />
            <img src="https://via.placeholder.com/220x220" alt="SNS 이미지 3" />
            <img src="https://via.placeholder.com/220x220" alt="SNS 이미지 4" />
            <img src="https://via.placeholder.com/220x220" alt="SNS 이미지 5" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ShopReview;
