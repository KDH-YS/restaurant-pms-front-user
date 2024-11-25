import React, { useState } from "react";

export function ReviewForm() {
  const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일
  const [tasteRating, setTasteRating] = useState(0); // 맛 평점
  const [serviceRating, setServiceRating] = useState(0); // 서비스 평점
  const [atmosphereRating, setAtmosphereRating] = useState(0); // 분위기 평점
  const [valueRating, setValueRating] = useState(0); // 가성비 평점

  const [userId] = useState(1); // 미리 지정된 userId
  const [restaurantId] = useState(1); // 미리 지정된 restaurantId

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("user_id", userId); // user_id 추가
    formData.append("review_content", reviewContent); // 리뷰 내용
    formData.append("restaurant_id", restaurantId); // restaurant_id 값 추가
    formData.append("taste_rating", tasteRating); // 맛 평점 추가
    formData.append("service_rating", serviceRating); // 서비스 평점 추가
    formData.append("atmosphere_rating", atmosphereRating); // 분위기 평점 추가
    formData.append("value_rating", valueRating); // 가성비 평점 추가
    if (selectedFile) {
      formData.append("image", selectedFile); // 이미지 파일
    }

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        body: formData, // FormData로 전송
      });

      if (response.ok) {
        console.log("리뷰가 성공적으로 제출되었습니다.");
      } else {
        console.error("리뷰 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 제출 중 오류가 발생했습니다:", error);
    }
  };

  // 평점 선택을 위한 함수
  const handleRatingChange = (setter) => (event) => setter(parseInt(event.target.value));

  return (
    <div className="container">
      <div className="js_formShop">
        <p>한치, 모밀</p>
        <h3>부산한치모밀</h3>
        <p>2024년 11월 10일에 방문했어요.</p>
        <img src="" alt="별점" />
        <p>(10명의 평기)</p>
      </div>

      <div className="js_menu_review">
        <h3>메뉴</h3>
        <p>한치모밀中(1~2일)</p>
        <p>계란찜</p>
        <p>맥주</p>
        <p>28,000원</p>
        <p>2,000원</p>
        <p>4,000원</p>
        <div className="js_line"></div>
        <p>총 금액</p>
        <p>34,000원</p>
      </div>

      <div className="js_key_word">
        <img src="" alt="맛있어요" />
        <img src="" alt="친절해요" />
        <img src="" alt="특별한 메뉴가 있어요" />
        <img src="" alt="주차하기 편해요" />
      </div>

      <div className="js_review_form">
        <form onSubmit={handleSubmit}>
          {/* 이미지 업로드 */}
          <div>
            <label htmlFor="formFile" className="form-label mt-4">이미지 업로드</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>

          {/* 리뷰 내용 */}
          <div>
            <label htmlFor="exampleTextarea" className="form-label mt-4">Comment</label>
            <textarea
              className="form-control"
              id="exampleTextarea"
              rows="3"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
          </div>

          {/* 평점 항목 */}
          <div className="ratings">
            <div>
              <label className="form-label mt-4">맛 평가 (1-5)</label>
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`tasteRating${rating}`}
                    name="tasteRating"
                    value={rating}
                    checked={tasteRating === rating}
                    onChange={handleRatingChange(setTasteRating)}
                  />
                  <label className="form-check-label" htmlFor={`tasteRating${rating}`}>
                    {rating}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label className="form-label mt-4">서비스 평가 (1-5)</label>
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`serviceRating${rating}`}
                    name="serviceRating"
                    value={rating}
                    checked={serviceRating === rating}
                    onChange={handleRatingChange(setServiceRating)}
                  />
                  <label className="form-check-label" htmlFor={`serviceRating${rating}`}>
                    {rating}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label className="form-label mt-4">분위기 평가 (1-5)</label>
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`atmosphereRating${rating}`}
                    name="atmosphereRating"
                    value={rating}
                    checked={atmosphereRating === rating}
                    onChange={handleRatingChange(setAtmosphereRating)}
                  />
                  <label className="form-check-label" htmlFor={`atmosphereRating${rating}`}>
                    {rating}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label className="form-label mt-4">가성비 평가 (1-5)</label>
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`valueRating${rating}`}
                    name="valueRating"
                    value={rating}
                    checked={valueRating === rating}
                    onChange={handleRatingChange(setValueRating)}
                  />
                  <label className="form-check-label" htmlFor={`valueRating${rating}`}>
                    {rating}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <button className="btn btn-lg btn-primary" type="submit">리뷰 제출</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
