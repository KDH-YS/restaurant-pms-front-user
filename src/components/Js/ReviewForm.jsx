import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "../../css/main.css";
import "../../css/ReviewForm.css";

export function ReviewForm() {
  const [reviewContent, setReviewContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tasteRating, setTasteRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [atmosphereRating, setAtmosphereRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [userId] = useState(1);
  const [restaurantId] = useState(1);
  const [restaurant, setRestaurant] = useState(null);
  const [reservation, setReservation] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}`,);
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant);
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchReservation = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/js/reservation/77`);
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
    if (tasteRating === 0 || serviceRating === 0 || atmosphereRating === 0 || valueRating === 0) {
      alert("모든 평점을 선택해주세요.");
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
    formData.append("taste_rating", tasteRating);
    formData.append("service_rating", serviceRating);
    formData.append("atmosphere_rating", atmosphereRating);
    formData.append("value_rating", valueRating);
    formData.append("reservation_id", reservation.reservationId);

    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        body: formData,
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

  if (!reservation || !restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4 no-hover">
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

      <Card className="no-hover">
        <Card.Body>
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

            <div className="js-ratings mt-4">
              {["맛", "서비스", "분위기", "가성비"].map((label, index) => {
                const rating = [tasteRating, serviceRating, atmosphereRating, valueRating][index];
                const setter = [setTasteRating, setServiceRating, setAtmosphereRating, setValueRating][index];

                return (
                  <Form.Group key={label} className="mb-4">
                    <Form.Label className="fw-bold">{label} 평가 (1-5)</Form.Label>
                    <Row>
                      {[1, 2, 3, 4, 5].map((ratingValue) => (
                        <Col key={ratingValue} xs="auto">
                          <Form.Check
                            type="radio"
                            label={ratingValue}
                            value={ratingValue}
                            checked={rating === ratingValue}
                            onChange={handleRatingChange(setter)}
                          />
                        </Col>
                      ))}
                    </Row>
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
