import React, { useState, useEffect } from "react";
import "../../css/main.css";
import "../../css/myreview.css";

export function MyReview() {
  const [reviews, setReviews] = useState([]); // 내 리뷰 상태

  useEffect(() => {
    // useEffect를 사용하여 내 리뷰 데이터를 가져옵니다.
    const userId = 1;  // 로그인한 유저의 ID (예시로 1을 사용)
    fetchReviews(userId);
  }, []);

  const fetchReviews = async (userId) => {
    try {
      // 서버에서 내 리뷰를 가져오는 API 요청
      const response = await fetch(`http://localhost:8080/mypage/${userId}/reviews`);
      const data = await response.json();
      setReviews(data);  // 가져온 데이터를 상태에 저장
    } catch (error) {
      console.error("내 리뷰를 불러오는 데 실패했습니다", error);
    }
  };

  return (
    <div className="container">
      <div className="js_my_review">
        <h3>내 리뷰</h3>
        <ul>
          {reviews.map((review) => (
            <li key={review.review_id}>
              {/* 리뷰 이미지 */}
              <img src={review.image_url || "https://via.placeholder.com/300x360"} alt={review.restaurant_name} />
              <div>
                <p>{review.review_content}</p>
                <p>{review.restaurant_address}</p>
                <p>{review.restaurant_name}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* 버튼 */}
        <button className="btn btn-lg btn-primary" type="button">
          Block button
        </button>
      </div>
    </div>
  );
}

export default MyReview;
