import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ListGroup, ProgressBar, Modal, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "../../css/main.css";
import "../../css/shopReview.css";

import { useAuthStore } from "store/authStore";
import { restaurantStore } from 'store/restaurantStore';

export function ShopReview() {
  // api상태관리
  // 가게
  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantImg, setRestaurantImg] = useState([]);
  // 유저
  const [users, setUsers] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 리뷰
  const [reviews, setReviews] = useState([]);
  const [reviewImages, setReviewImages] = useState({});
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [ratingCount, setRatingCount] = useState({});
  // 평점
  const averageRating = reviews[0]?.averageRating || 0; // 평균 평점이 존재하면 사용, 없으면 0
  // 수정
  const [isEditing, setIsEditing] = useState(null); // 수정 중인 리뷰 ID
  const [editedContent, setEditedContent] = useState(""); // 수정 중인 내용
  // 신고
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReviewId, setReportReviewId] = useState(null);
  const [reportContent, setReportContent] = useState("");
  const [reportReason, setReportReason] = useState("OTHER");
  // 도움
  const [helpfulReviews, setHelpfulReviews] = useState({});
  // 주스탠드
  const { restaurant } = restaurantStore();
  const restaurantId = restaurant.restaurantId
  const { token } = useAuthStore();
  const userId = parseJwt(token)?.userId; // JWT에서 userId 추출
  // 프론트 상태관리
  const [showReviewsCount, setShowReviewsCount] = useState(5);
  const [showPhotosCount, setShowPhotosCount] = useState(3);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPhotoReviewsOnly, setShowPhotoReviewsOnly] = useState(false);
  const navigate = useNavigate();
  
  const imgUrl = "https://storage.cofile.co.kr/ysit24restaurant-bucket/";
  
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
      const response = await fetch(`http://localhost:8080/api/restaurants/${restaurant.restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurantData(data.restaurant);
        setRestaurantImg(data.restaurantImg);
      } else {
        console.error("가게 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("가게 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      let url = `http://localhost:8080/api/restaurants/${restaurant.restaurantId}/reviews`;
      if (userId) {
        url += `?userId=${userId}`;
      }
  
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
  
        // 리뷰 데이터가 존재하는지 확인
        const reviewsData = (data.reviews || []).map(reviewData => ({
          ...reviewData.review,
          isHelpful: reviewData.isHelpful || false,
          helpfulCount: reviewData.helpfulCount || 0
        }));
  
        setReviews(reviewsData);
  
        // 리뷰 이미지가 존재하는지 확인
        const reviewImagesData = data.images || {};
        setReviewImages(reviewImagesData);
  
        // 평점 비율 계산 및 상태 업데이트
        const { ratingCount, ratingDistribution } = calculateRatingDistribution(reviewsData);
        setRatingCount(ratingCount);
        setRatingDistribution(ratingDistribution);
  
        // 좋아요 상태 설정
        const helpfulStatus = {};
        reviewsData.forEach(review => {
          helpfulStatus[review.reviewId] = review.isHelpful || false;
        });
        setHelpfulReviews(helpfulStatus);
      } else {
        console.error("리뷰 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 평점 비율 계산 함수
  const calculateRatingDistribution = (reviews) => {
    const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const totalReviews = reviews.length;

    reviews.forEach((review) => {
      if (ratingCount[review.rating] !== undefined) {
        ratingCount[review.rating] += 1;
      }
    });

    const ratingDistribution = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = totalReviews > 0 ? Math.round((ratingCount[i] / totalReviews) * 100) : 0;
    }

    return { ratingCount, ratingDistribution };
  };

  const fetchUsers = async () => {
    if (restaurantId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/js/users/${restaurantId}`
        );
        if (response.ok) {
          const data = await response.json();
          const usersData = {};
          data.forEach((user) => {
            if (user && user.userId && user.userName) {
              usersData[user.userId] = user.userName;
            }
          });
          setUsers(usersData);
        } else {
          console.error("유저 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
      }
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
    fetchRestaurant();
    fetchUsers();
    fetchReviews();
  }, [restaurant.restaurantId]);

  const handleReportSubmit = async () => {
    if (reportReviewId && reportContent) {
      try {
        const response = await fetch(`http://localhost:8080/api/reviews/${reportReviewId}/report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reviewId: reportReviewId,
            userId: userId,
            reason: reportReason,
            reportDescription: reportContent,
          }),
        });

        if (response.ok) {
          console.log("신고가 성공적으로 접수되었습니다.");
          setReportContent("");
          setReportReason("OTHER");
          setShowReportModal(false);
        } else {
          console.error("신고를 접수하는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("신고를 접수하는 중 오류 발생:", error);
      }
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    // 비회원일 경우 로그인 모달 표시
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
  
    const currentStatus = helpfulReviews[reviewId]; // 현재 좋아요 상태
    const updatedReviews = reviews.map((review) => {
      if (review.reviewId === reviewId) {
        return {
          ...review,
          helpfulCount: currentStatus
            ? review.helpfulCount - 1 // 현재 좋아요 상태일 때 취소
            : review.helpfulCount + 1, // 좋아요 추가
        };
      }
      return review;
    });
  
    try {
      const url = currentStatus
        ? `http://localhost:8080/api/reviews/${reviewId}/helpful?userId=${userId}`
        : `http://localhost:8080/api/reviews/${reviewId}/helpful`;
  
      const options = {
        method: currentStatus ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      if (!currentStatus) {
        options.body = JSON.stringify({
          userId: userId,
          state: 1,
        });
      }
  
      // 서버 요청 전 UI를 바로 반영
      setHelpfulReviews((prev) => ({
        ...prev,
        [reviewId]: !currentStatus,
      }));
      setReviews(updatedReviews);
  
      const response = await fetch(url, options);
  
      if (!response.ok) {
        // 서버 오류 시 원래 상태로 복구
        setHelpfulReviews((prev) => ({
          ...prev,
          [reviewId]: currentStatus,
        }));
        setReviews(reviews);
        console.error("서버 오류로 인해 좋아요 처리가 실패했습니다.");
      }
    } catch (error) {
      // 에러 시 상태 복구
      setHelpfulReviews((prev) => ({
        ...prev,
        [reviewId]: currentStatus,
      }));
      setReviews(reviews);
      console.error("도움이 되었습니다/취소를 처리하는 중 오류 발생:", error);
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

  const handleShowMoreReviews = () => {
    setShowReviewsCount(showReviewsCount + 3);
  };

  const handleShowMorePhotos = () => {
    setShowPhotosCount(showPhotosCount + 3);
  };

  const handleReportClick = (reviewId) => {
    setReportReviewId(reviewId);
    setShowReportModal(true);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };
  
  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate("/login"); // 로그인 페이지 경로로 수정
  };

  const filteredReviews = showPhotoReviewsOnly
  ? reviews.filter(review => reviewImages[review.reviewId] && reviewImages[review.reviewId].length > 0)
  : reviews;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <Container className="mt-4">
      {/* 가게 정보 섹션 */}
      <Row className="justify-content-center mb-4">
        <Col md={12}>
          <div className="js-shop-info">
            {restaurantImg.length > 0 ? (
              <img
                src={imgUrl + restaurantImg[0].imageUrl}
                alt="가게 이미지"
                className="img-fluid mb-3 rounded"
              />
            ) : (
              <p>가게 이미지가 없습니다.</p>
            )}
            <p className="js-food-type">{restaurantData.foodType} | {restaurantData.neighborhood}</p>
            <h2 className="fw-bold">{restaurantData.name}</h2>
            <p className="js-address">{restaurantData.address}</p>
          </div>
        </Col>
      </Row>

      {/* 평점 섹션 */}
      <Row className="mb-4">
        <Row md={12} className="text-center js-rating-section">
          <Col md={4} className="js-star-rating">
            <span className="fs-1 text-warning">★</span>
            <span className="fs-3 fw-bold">{parseFloat(averageRating).toFixed(1)}</span>
          </Col>
          <Col>
            <ProgressBar now={ratingDistribution[5]} label={`5점 (${ratingCount[5]}개)`} className="mb-2" />
            <ProgressBar now={ratingDistribution[4]} label={`4점 (${ratingCount[4]}개)`} className="mb-2" />
            <ProgressBar now={ratingDistribution[3]} label={`3점 (${ratingCount[3]}개)`} className="mb-2" />
            <ProgressBar now={ratingDistribution[2]} label={`2점 (${ratingCount[2]}개)`} className="mb-2" />
            <ProgressBar now={ratingDistribution[1]} label={`1점 (${ratingCount[1]}개)`} />
          </Col>
        </Row>
      </Row>

      {/* 사진/영상 리뷰 섹션 */}
      <Row className="mb-4 js-photo-review">
        <Col>
          <h3 className="js-section-title">사진/영상 리뷰</h3>
          <Row>
            {reviews.slice(0, showPhotosCount)
              .filter(review => reviewImages[review.reviewId] && reviewImages[review.reviewId].length > 0) // 필터링 추가
              .map((review, index) => (
                <Col md={4} className="mb-3" key={index}>
                  <img
                    src={imgUrl + reviewImages[review.reviewId][0].imageUrl}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="img-fluid rounded shadow-sm"
                  />
                </Col>
              ))}
          </Row>
          {/* 사진/영상 리뷰가 더 있으면 더보기 버튼 표시 */}
          {reviews.filter(review => reviewImages[review.reviewId] && reviewImages[review.reviewId].length > 0).length > showPhotosCount && (
            <Button variant="primary" onClick={handleShowMorePhotos} className="js-more-btn">
              더보기
            </Button>
          )}
        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Row className="js-reviews">
        <Col>
            <h3 className="js-section-title mb-0" 
              style={{ cursor: "default" }}
            >리뷰
            <span 
              onClick={() => setShowPhotoReviewsOnly(prev => !prev)} 
              className="ms-3"
              style={{ 
                cursor: "pointer",
                fontSize: "14px"
               }}
            >
              {showPhotoReviewsOnly ? "모든 리뷰 보기" : "사진 리뷰만 보기"}
            </span>
            </h3>
          <ListGroup>
          {filteredReviews.slice(0, showReviewsCount).map((review) => (
            <ListGroup.Item key={review.reviewId} className="js-review-item">
              <Row className="align-items-center">
                <img
                  src={review.imageUrl || "https://via.placeholder.com/40x40"}
                  alt="리뷰 프로필 이미지"
                  className="img-fluid rounded-circle mb-0"
                />
                <Col xs={8} className="d-flex flex-column">
                  <p className="mb-0 fw-bold">{users[review.userId]}</p>
                  <p className="text-muted small mb-0">{formatDate(review.createdAt)}</p>
                </Col>
                <Col className="d-flex justify-content-end align-items-start gap-2">
                  <img
                    src={helpfulReviews[review.reviewId] ? "/icons/heart.svg" : "/icons/heart-regular.svg"}
                    alt="좋아요"
                    onClick={() => handleHelpfulClick(review.reviewId)}
                    style={{ cursor: "pointer" }}
                  />
                  <p className="small text-muted">{review.helpfulCount}명의 좋아요</p>
                  <img
                    src="/icons/siren.png"
                    alt="신고하기"
                    onClick={() => handleReportClick(review.reviewId)}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                </Col>
                {reviewImages[review.reviewId] && reviewImages[review.reviewId].length > 0 && (
                  <div className="mt-2">
                    {reviewImages[review.reviewId].map((image, index) => (
                      <img
                        key={index}
                        src={imgUrl + image.imageUrl}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="img-fluid rounded"
                      />
                    ))}
                  </div>
                )}
              </Row>
              <Row className="mt-3">
                <Col>
                  {isEditing === review.reviewId ? (
                    <Form.Control
                      type="textarea"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                  ) : (
                    <p className="mb-0">{review.reviewContent}</p>
                  )}
                </Col>
                <Col xs={4} className="d-flex justify-content-end align-items-end">
                  {review.userId === userId && (
                    <>
                      {isEditing === review.reviewId ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditSubmit(review.reviewId)}
                        >
                          완료
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setIsEditing(review.reviewId);
                            setEditedContent(review.reviewContent);
                          }}
                        >
                          수정
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(review.reviewId)}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
          {filteredReviews.length > showReviewsCount && (
            <Button variant="primary" onClick={handleShowMoreReviews} className="js-more-btn mt-3">
              더보기
            </Button>
          )}
        </ListGroup>
        </Col>
      </Row>

      {/* 리뷰 삭제 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
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

      {/* 신고 작성 모달 */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 신고하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reportReason">
              <Form.Label>신고 이유</Form.Label>
              <Form.Control
                as="select"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="기타">기타</option>
                <option value="부적절한 내용">부적절한 내용</option>
                <option value="인증되지 않은 글">인증되지 않은 글</option>
                <option value="모욕적">모욕적 언어 사용</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="reportContent">
              <Form.Label>신고 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleReportSubmit}>
            신고하기
          </Button>
        </Modal.Footer>
      </Modal>
      {/* 로그인 안내 모달 */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>로그인 필요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>좋아요 기능을 사용하려면 로그인이 필요합니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleLoginClick}>
            로그인
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ShopReview;