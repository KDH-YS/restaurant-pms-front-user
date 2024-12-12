import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, ListGroup, Modal } from "react-bootstrap";
import "../../css/main.css";
import "../../css/myreview.css";
import { useAuthStore } from "store/authStore";
import { jwtDecode } from "jwt-decode";

export function MyReview() {
  const [reviews, setReviews] = useState([]);
  const [reviewImg, setReviewImg] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // 수정 중인 리뷰 ID
  const [editedContent, setEditedContent] = useState(""); // 수정 중인 내용
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [user, setUser] = useState({});
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const {token}= useAuthStore();
  const [ restaurant, setRestaurant ] = useState([]);
  
  // 주스탠드
  const userId = jwtDecode(token).userId;
  const textareaRef = useRef(null); // textarea 요소 참조

  // 유저정보를 가져오는 API 요청
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/js/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
        'Content-Type': 'application/json'
      }
    });
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
      const userId = jwtDecode(token).userId;
      const response = await fetch(`http://localhost:8080/api/mypage/${userId}/reviews`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setReviewImg(data.reviewImages);
        setRestaurant(data.restaurants);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.reviewId !== reviewToDelete));
        setShowDeleteModal(false);
        console.log("리뷰 삭제 성공");
      } else {
        console.error("리뷰 삭제 실패");
      }
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
    }
  };

  // 리뷰 수정 API 호출
  const handleEditSubmit = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewContent: editedContent,
        }),
      });
      if (response.ok) {
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewId === reviewId ? { ...review, reviewContent: editedContent } : review
          )
        );
        setIsEditing(null); // 수정 모드 종료
        setEditedContent("");
      } else {
        console.error("리뷰 수정 실패");
      }
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMyReviews();
  }, []);

  const handleShowMoreReviews = () => {
    setReviewsToShow(reviewsToShow + 2);
  };
  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };
  // textarea 높이를 동적으로 조정
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 기존 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용 높이 반영
    }
  };
  // 수정 버튼 클릭 시 호출
  const handleEditClick = (review) => {
    setIsEditing(review.reviewId);
    setEditedContent(review.reviewContent);
    setTimeout(adjustTextareaHeight, 0); // 다음 렌더링 주기에서 높이를 설정
  };
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 기존 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용 높이 반영
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-center">
        <Col md={8} className="text-center">
          <div className="js-user-info">
            <img
              src="/img/restaurant_icon.png"
              alt="User Profile"
              className="img-fluid rounded-circle js-user-profile-img"
            />
            <h2 className="js-user-name">{user.name}</h2>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <h3 className="js-section-title">내 리뷰</h3>
          <ListGroup className="js-review-list">
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.slice(0, reviewsToShow).map((review) => {
                const images = reviewImg.filter((img) => img.reviewId === review.reviewId);
                return (
                  <ListGroup.Item key={review.reviewId} className="js-review-item mb-3">
                    <Row className="align-items-center">
                      <img
                      src="/img/restaurant_icon.png"
                      alt="리뷰 프로필 이미지"
                      className="img-fluid rounded-circle mb-0"
                      />
                      <Col xs={8} className="d-flex flex-column">
                        <p className="text-muted small mb-0">{restaurant[0]?.foodType}</p>
                        <p className="mb-0 fw-bold">{restaurant[0]?.name}</p>
                      </Col>
                      {/* 여러 이미지 렌더링 */}
                      {images.length > 0 && (
                        <div className="mt-4 d-flex flex-wrap gap-2">
                          {images.map((image, index) => (
                            <img
                              key={index}
                              src={image.imageUrl}
                              alt={`리뷰 이미지 ${index + 1}`}
                              className="img-fluid rounded js-review-image"
                            />
                          ))}
                        </div>
                      )}
                      {/* 리뷰 내용 */}
                      <Col md={8} xs={9}>
                        {isEditing === review.reviewId ? (
                          // 수정 중일 때 textarea 표시
                          <textarea
                            ref={textareaRef} // 참조 추가
                            className="form-control js-review-textarea"
                            value={editedContent}
                            onChange={(e) => {
                              setEditedContent(e.target.value);
                              adjustTextareaHeight(); // 내용 변경 시 높이 조정
                            }}
                            onInput={adjustTextareaHeight} // 입력 시 높이 조정
                          />
                        ) : (
                          // 수정 중이 아닐 때 기존 내용 표시
                          <>
                          <p className="js-review-content mt-4">{review.reviewContent}</p>
                          <p className="text-muted small mb-0">{formatDate(review.createdAt)}</p>
                          </>
                        )}
                      </Col>
                      {/* 버튼 섹션 */}
                      <Col md={4} className="d-flex justify-content-end align-items-end">
                        {review.userId === userId && (
                          <>
                            {isEditing === review.reviewId ? (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleEditSubmit(review.reviewId)}
                                >
                                  완료
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setIsEditing(null); // 수정 취소
                                    setEditedContent(""); // 내용 초기화
                                  }}
                                >
                                  취소
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => {
                                    setIsEditing(review.reviewId); // 수정 모드 활성화
                                    setEditedContent(review.reviewContent); // 기존 내용 설정
                                  }}
                                >
                                  수정
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteClick(review.reviewId)}
                                >
                                  삭제
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })
            ) : (
              <p>리뷰가 없습니다.</p>
            )}
          </ListGroup>
          {reviews.length > reviewsToShow && (
            <Button
              variant="primary"
              size="lg"
              className="js-more-btn mt-3 w-100"
              onClick={handleShowMoreReviews}
            >
              더보기
            </Button>
          )}
        </Col>
      </Row>

      {/* 리뷰 삭제 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>리뷰를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            아니요
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            예
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default MyReview;
