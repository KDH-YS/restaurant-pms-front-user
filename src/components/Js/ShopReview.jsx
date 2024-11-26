import React, { useEffect, useState } from "react";
import "../../css/main.css";
import "../../css/shopReview.css";

export function ShopReview() {

  const [restaurantId] = useState(1); // 미리 지정된 restaurantId
  const [reviews, setReviews] = useState([]); // 내 리뷰 상태
  const [reviewImgs, setReviewImgs] = useState([]); // 사진리뷰 상태
  const [restaurant, setRestaurant] = useState(1); // 가게 정보 상태

    // 가게 정보를 가져오는 함수
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}`);
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data); // 받은 데이터를 가게 정보 상태에 설정
        } else {
          console.error("가게 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("가게 정보를 가져오는 중 오류 발생:", error);
      }
    };
  
    // 가게 정보 가져오기
    useEffect(() => {
      fetchRestaurant();
    }, [restaurantId]); // restaurantId가 변경될 때마다 가게 정보를 가져옴

    // 사진 리뷰를 가져오는 API
    const fetchReviewImgs = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviewImgs(data);
        } else {
          console.error("리뷰 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
      }
    };

    // 내 리뷰 데이터를 가져옵니다.
    useEffect(() => {
      fetchReviewImgs();
    }, []);

    // 내 리뷰를 가져오는 API
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}/reviews`);
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
      fetchReviews();
    }, []);


  return (
    <>
    <div className="container">
      <div className="content">
        <div className="js_shop_info">
          <img src="https://via.placeholder.com/648x400" alt="" />
          <img src="https://via.placeholder.com/648x400" alt="" />
          <h2>{restaurant.name}</h2>
          <p>{restaurant.address}</p>
          <p>{restaurant.foodType}</p>
        </div>
        <div className="js_photo_review">
          <h3>사진/영상 리뷰</h3>
          <img src="https://via.placeholder.com/324x324" alt="" />
          <img src="https://via.placeholder.com/324x324" alt="" />
          <img src="https://via.placeholder.com/324x324" alt="" />
          <img src="https://via.placeholder.com/324x324" alt="" />
          <button class="btn btn-lg btn-prima ry" type="button">Block button</button>
        </div>
        <ul className="js_review">
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <div>
                <h3>리뷰</h3>
                <img src={review.reviewerImage} alt={review.reviewerName} />
                <p>{review.reviewerName}</p>
                <p>리뷰 {review.reviewId} 팔로워 12 팔로잉 2</p>
              </div>
              <div>
                <img src={review.imageUrl} alt="음식 이미지" />
                <p>{review.reviewText}</p>
                <p>더보기</p>
                <span>음식이 맛있어요</span>
                <span>특별한 메뉴가 있어요</span>
                <br />
                <img src="https://via.placeholder.com/40x40" alt="반응 아이콘" />
                <p>반응 남기기</p>
                <p>
                  {review.reviewDate} {review.visitOrder} 영수증
                </p>
              </div>
              <div className="js_line"></div>
            </li>
          ))}
          <button class="btn btn-lg btn-prima ry" type="button">Block button</button>
        </ul>
        <ul className="js_sns_review">
          <h3>SNS</h3>
          <p>참고 할만한 리뷰들</p>
          <li>
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <p>부산한치모밀</p>
            <p>한치, 모밀</p>
          </li>
        </ul>
      </div>
    </div>
    </>
  )
}

export default ShopReview;