import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "../../css/main.css";
import "../../css/ReviewForm.css";
import { useParams, useNavigate } from "react-router-dom";

import baseUrlStore from "store/baseUrlStore";
import { useAuthStore } from "store/authStore";

export function ReviewForm() {
  const [reviewContent, setReviewContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantImg, setRestaurantImg] = useState(null);
  const [reservation, setReservation] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input
  
  const { restaurantId,reservationId } = useParams();
  const navigate = useNavigate(); // 네비게이트 훅 사용

  const { token } = useAuthStore();
  const userId = parseJwt(token)?.userId; // JWT에서 userId 추출

  const {apiUrl} = baseUrlStore();
  // JWT 파싱 함수
  function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/restaurants/${restaurantId}`,);
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant);
        setRestaurantImg(data.restaurantImg);
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchReservation = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/js/reservation/${reservationId}`);
      if (response.ok) {
        const data = await response.json();
        setReservation(data);
      } else {
        console.error("예약 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("예약 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchReservation();
  }, [restaurantId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reviewContent.trim()) {
      alert("리뷰 내용을 작성해주세요.");
      return;
    }
    if (rating === 0 ) {
      alert("평점을 선택해주세요.");
      return;
    }
    if (!reservation) {
      alert("예약 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("review_content", reviewContent);
    formData.append("restaurant_id", restaurantId);
    formData.append("rating", rating);
    formData.append("reservation_id", reservation.reservationId);

    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("리뷰가 성공적으로 제출되었습니다.");
        navigate("/ReservationStatus"); // 리뷰 제출 성공 후 이동
      } else {
        const errorData = await response.json();
        alert(`리뷰 제출에 실패했습니다: ${errorData.message || '서버 오류'}`);
      }
    } catch (error) {
      console.error("Error message:", error.message);
    }
  };

  const handleRatingChange = (setter) => (event) => setter(parseInt(event.target.value));

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${year}년 ${month}월 ${day}일 ${hours}시${minutes}분`;
  };

  if (!reservation || !restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4 no-hover">
        <Card.Body>
          <Card.Text className="text-muted small mb-0">{restaurant.foodType}</Card.Text>
          <Card.Title>{restaurant.name}</Card.Title>
          <Card.Img
            variant="top"
            src={restaurantImg[0]?.imageUrl.trim()}
            alt="가게 대표 사진"
            style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover' }}
          />
          <Card.Text>{restaurant.address}</Card.Text>
          <Card.Text>{restaurant.phone}</Card.Text>
          <Card.Text>평균 평가: {restaurant.averageRating}</Card.Text>
          <Card.Text>상세 설명: {restaurant.description}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="no-hover">
        <Card.Body>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">평가 (1-5)</Form.Label>
          
          <div className="mt-3 d-flex">
            {[1,2,3,4,5].map((starValue) => (
              <img
                key={starValue}
                src={starValue <= rating ? "/icons/star.svg" : "/icons/star-regular.svg"}
                alt=""
                style={{ width: '40px', height: '40px', marginRight: '4px', cursor: 'pointer' }}
                onClick={() => setRating(starValue)} // 별 클릭 시 해당 rating으로 설정
              />
            ))}
          </div>
        </Form.Group>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mt-4">
              <Form.Label>이미지 업로드</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef} // Attach the ref to file input
              />
              <div className="js-image-preview-container mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="js-preview-image mb-2 position-relative">
                    <img src={preview} alt={`미리보기 ${index + 1}`} className="img-thumbnail" />
                    <Button
                      variant="danger"
                      size="sm"
                      className="js-remove-image-btn position-absolute"
                      onClick={() => handleRemoveImage(index)}>X</Button>
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group controlId="reviewContent" className="mt-4">
              <Form.Label>리뷰 내용</Form.Label>
              <Form.Control
                as="textarea"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="리뷰를 작성해주세요"
              />
            </Form.Group>

            <p className="mt-4  mb-0 fw-bold">예약시간</p>
            <p className="mb-0 small">{formatDateTime(reservation.reservationTime)}</p>
            <Button type="submit" variant="primary" className="mt-4 mb-4">리뷰 제출</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ReviewForm;
