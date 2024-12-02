import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "../../css/main.css";
import "../../css/ReviewForm.css";

export function ReviewForm() {
  const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용
  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일들
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기
  const [tasteRating, setTasteRating] = useState(0); // 맛 평점
  const [serviceRating, setServiceRating] = useState(0); // 서비스 평점
  const [atmosphereRating, setAtmosphereRating] = useState(0); // 분위기 평점
  const [valueRating, setValueRating] = useState(0); // 가성비 평점
  const [userId] = useState(1); // 미리 지정된 userId
  const [restaurantId] = useState(1); // 미리 지정된 restaurantId
  const [restaurant, setRestaurant] = useState(null); // 가게 정보 상태
  const [reservation, setReservation] = useState(null); // 예약 정보 상태

  // 가게 정보를 가져오는 함수
  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant); // 받은 데이터를 가게 정보 상태에 설정
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 예약 정보를 가져오는 함수
  const fetchReservation = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/js/reservation/77`); // @@@예약ID 수정 필요@@@
      if (response.ok) {
        const data = await response.json();
        setReservation(data); // 받은 데이터를 예약 정보 상태에 설정
      } else {
        console.error("예약 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("예약 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 페이지 로드 시 가게 정보와 예약 정보를 가져옴
  useEffect(() => {
    fetchRestaurant();
    fetchReservation();
  }, [restaurantId]);

  // 리뷰 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reviewContent.trim()) {
      alert("리뷰 내용을 작성해주세요.");
      return;
    }
    if (tasteRating === 0 || serviceRating === 0 || atmosphereRating === 0 || valueRating === 0) {
      alert("모든 평점을 선택해주세요.");
      return;
    }

    // reservation이 로드되지 않았으면, 폼 제출을 막음
    if (!reservation) {
      alert("예약 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId); // user_id 추가
    formData.append("review_content", reviewContent); // 리뷰 내용
    formData.append("restaurant_id", restaurantId); // restaurant_id 값 추가
    formData.append("taste_rating", tasteRating); // 맛 평점 추가
    formData.append("service_rating", serviceRating); // 서비스 평점 추가
    formData.append("atmosphere_rating", atmosphereRating); // 분위기 평점 추가
    formData.append("value_rating", valueRating); // 가성비 평점 추가
    formData.append("reservation_id", reservation.reservationId); // 예약 ID 추가

    // 여러 파일을 FormData에 추가
    selectedFiles.forEach(file => {
      formData.append("images", file); // 이미지 파일
    });

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        body: formData, // FormData로 전송
      });

      if (response.ok) {
        alert("리뷰가 성공적으로 제출되었습니다.");
      } else {
        const errorData = await response.json();
        alert(`리뷰 제출에 실패했습니다: ${errorData.message || '서버 오류'}`);
      }
    } catch (error) {
      console.error("Error message:", error.message);
    }
  };

  // 평점 선택을 위한 함수
  const handleRatingChange = (setter) => (event) => setter(parseInt(event.target.value));

  // 파일 변경 핸들러
  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const newFiles = Array.from(files); // 선택된 파일들을 배열로 변환
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]); // 기존 파일들에 새 파일을 추가

      const newPreviews = newFiles.map(file => URL.createObjectURL(file)); // 새 파일들에 대한 미리보기 URL 생성
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]); // 기존 미리보기들에 새 미리보기 URL을 추가
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  if (!reservation || !restaurant) {
    return <div>Loading...</div>; // 예약 정보나 가게 정보가 로드되지 않았을 때 로딩 중 표시
  }

  return (
    <Container className="mt-4">
      {/* 가게 정보 표시 */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{restaurant.name}</Card.Title>
          <Card.Text>{restaurant.foodType}</Card.Text>
          <Card.Img variant="top" src={restaurant.mainImageUrl} alt="가게 대표 사진" />
          <Card.Text>{restaurant.address}</Card.Text>
          <Card.Text>{restaurant.phone}</Card.Text>
          <Card.Text>평균 평가: {restaurant.averageRating}</Card.Text>
          <Card.Text>상세 설명: {restaurant.description}</Card.Text>
        </Card.Body>
      </Card>

      {/* 리뷰 제출 폼 */}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* 이미지 업로드 */}
            <Form.Group controlId="formFile" className="mt-4">
              <Form.Label>이미지 업로드</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <div className="image-preview-container mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="preview-image mb-2">
                    <img src={preview} alt={`미리보기 ${index + 1}`} className="img-thumbnail" />
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleRemoveImage(index)}>이미지 제거</Button>
                  </div>
                ))}
              </div>
            </Form.Group>

            {/* 리뷰 내용 */}
            <Form.Group controlId="reviewContent" className="mt-4">
              <Form.Label>리뷰 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="리뷰를 작성해주세요"
              />
            </Form.Group>

            {/* 평점 항목 */}
            <div className="ratings mt-4">
              {["맛", "서비스", "분위기", "가성비"].map((label, index) => {
                const rating = [tasteRating, serviceRating, atmosphereRating, valueRating][index];
                const setter = [setTasteRating, setServiceRating, setAtmosphereRating, setValueRating][index];

                return (
                  <Form.Group key={label} className="mt-3">
                    <Form.Label>{label} 평가 (1-5)</Form.Label>
                    {[1, 2, 3, 4, 5].map((ratingValue) => (
                      <Form.Check
                        key={ratingValue}
                        type="radio"
                        label={ratingValue}
                        value={ratingValue}
                        checked={rating === ratingValue}
                        onChange={handleRatingChange(setter)}
                      />
                    ))}
                  </Form.Group>
                );
              })}
            </div>

            <p className="mt-3">{reservation.reservationTime}</p>
            <Button type="submit" variant="primary" className="mt-4">리뷰 제출</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ReviewForm;
