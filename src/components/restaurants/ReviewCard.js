import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import "../../css/restaurants/ReviewCard.css";
function ReviewCard() {
  const reviews = [
    { id: 1, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 2, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 3, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 4, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
  ];

  return (
    <div className="container">
      <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
        {reviews.map((review) => (
          <Col key={review.id}>
            <Card>
              <Card.Img variant="top" src={review.imgSrc} />
              <Card.Body>
                <Card.Title>{review.title}</Card.Title>
                <Card.Text>{review.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="warning" className="mt-3">리뷰 더보기</Button>
    </div>
  );
}

export default ReviewCard;
