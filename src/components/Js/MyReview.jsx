import React, { useState, useEffect } from "react";
import "../../css/main.css";
import "../../css/myreview.css";

export function MyReview() {
  const [reviews, setReviews] = useState([]); // 내 리뷰 상태
  const [reviewImg, setReviewImg] = useState([]); // 리뷰 이미지 상태
  const [user, setUser] = useState({}); // 유저정보 상태
  const [showMoreReviews, setShowMoreReviews] = useState(false); // 더보기 상태

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
        console.log(data);
        setReviews(data.reviews);
        setReviewImg(data.reviewImages);
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
    setShowMoreReviews(!showMoreReviews);
  };

  return (
    <div className="container">
      <div className="js_my_review">
        <div className="js_user_info">
          <img src={user.profileImageUrl || "https://via.placeholder.com/40x40"} alt="User Profile" />
          <p>{user.name}</p>
        </div>

        <ul>
          <h3>내 리뷰</h3>
          {/* 리뷰 목록을 조건에 맞게 보여줌 */}
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.slice(0, showMoreReviews ? reviews.length : 4).map((review) => {
              const image = reviewImg.find((img) => img.reviewId === review.reviewId);
              return (
                <li key={review.reviewId}>
                  <img
                    src={image ? image.imageUrl : "https://via.placeholder.com/300x360"}
                    alt={review.restaurantName}
                  />
                  <div>
                    <p>{review.reviewContent}</p>
                    <p>{review.restaurantAddress}</p>
                    <p>{review.restaurantName}</p>
                  </div>
                </li>
              );
            })
          ) : (
            <p>리뷰가 없습니다.</p>
          )}
        </ul>

        {/* 더보기 버튼 */}
        <button className="btn btn-lg btn-primary" type="button" onClick={handleShowMoreReviews}>
          {showMoreReviews ? "줄이기" : "더보기"}
        </button>
      </div>
    </div>
  );
}

export default MyReview;
