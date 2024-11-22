import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // useNavigate 임포트
import "../../css/restaurants/MenuCard.css";

function MenuCard() {
  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동

  const menuItems = [
    { id: 1, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 2, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 3, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 4, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 5, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
    { id: 6, title: "가게이름", description: "안녕하세용 길고긴 설명을 씁니다 1234564564950823", imgSrc: "/foodimg1.jpg" },
  ];

  const handleCardClick = () => {
    navigate('/reservemain');  // 클릭 시 '/reservemain' 경로로 이동
  };

  return (
    <div className="container">
      <Row xs={1} sm={2} md={3} lg={3} xl={3} className="g-4">
        {menuItems.map((item) => (
          <Col key={item.id}>
            <Card onClick={handleCardClick}> {/* Card 클릭 시 handleCardClick 호출 */}
              <Card.Img variant="top" src={item.imgSrc} />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default MenuCard;
