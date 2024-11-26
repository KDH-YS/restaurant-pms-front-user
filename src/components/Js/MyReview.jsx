import React, { useState, useEffect } from "react";
import "../../css/main.css";
import "../../css/myreview.css";

export function MyReview() {
  const [reviews, setReviews] = useState([]); // 내 리뷰 상태
  const [User, setUser] = useState([]); // 유저정보 상태

  // 유저정보를 가져오는 API 요청
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/js/user/1`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUser(data);
      } else {
        console.error("유저 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("유저 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 유저정보를 가져옵니다.
  useEffect(() => {
    fetchUser();
  }, []);

  // 내 리뷰를 가져오는 API
  const fetchMyReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/mypage/1/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 내 리뷰 데이터를 가져옵니다.
  useEffect(() => {
    fetchMyReviews();
  }, []);

  return (
    <div className="container">
      <div className="js_user_info">
        {}
      </div>
      <div className="js_my_review">
        <h3>내 리뷰</h3>
        <ul>
          {reviews.map((review) => (
            <li key={review.review_id}>
              <img src={review.image_url || "https://via.placeholder.com/300x360"} alt={review.restaurant_name} />
              <div>
                <p>{review.review_content}</p>
                <p>{review.restaurant_address}</p>
                <p>{review.restaurant_name}</p>
              </div>
            </li>
          ))}
        </ul>
        <button className="btn btn-lg btn-primary" type="button">더보기</button>
      </div>
    </div>
  );
}

export default MyReview;
