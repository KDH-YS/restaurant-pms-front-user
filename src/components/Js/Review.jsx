import React, { useEffect, useState } from "react";
import "../../css/bootstrap.min.css";
import "../../css/review.css";
import "../../css/main.css";

export function Review() {
  const [reviews, setReviews] = useState([]);

  // restaurantId는 필요한 값으로 변경하거나 props로 전달받을 수 있습니다.
  const restaurantId = 1;

  useEffect(() => {
    // fetch로 리뷰 목록을 가져옵니다.
    fetch(`http://localhost:8080/api/restaurants/${restaurantId}/reviews`, {  // 서버에서 정의한 경로와 일치하도록 수정
      method: 'GET', // GET 방식으로 요청
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('리뷰 데이터를 가져오는 중 오류 발생');
        }
        return response.json(); // JSON 응답을 파싱
      })
      .then(data => {
        console.log(data);
        setReviews(data); // 상태 업데이트
      })
      .catch(error => console.error('Error:', error)); // 에러 처리
  }, [restaurantId]);

  return (
    <div className="container">
      <div className="content">
        <ul className="js_review_list">
          <h3>{reviews.length}개의 리뷰</h3>
          {reviews.map((review) => (
            <li key={review.review_id}>
              <img src="https://via.placeholder.com/300x150" alt="그림" />
              <h4>{review.restaurantName}</h4>
              <p>{review.reviewContent}</p>
            </li>
          ))}
        </ul>
        {/* 페이지네이션 등 추가 UI */}
      </div>
    </div>
  );
}

export default Review;
