// src/components/Restaurants/RestaurantCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

const RestaurantCard = ({ restaurant, onCardClick }) => {
  return (
    <Card onClick={() => onCardClick(restaurant.restaurantId)}>
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
        <Card.Text>
          <strong>주소:</strong> {restaurant.address}
        </Card.Text>
        <Card.Text>
          <strong>음식 종류:</strong> {restaurant.foodType}
        </Card.Text>
        <Card.Text>
          <strong>전화:</strong> {restaurant.phone}
        </Card.Text>
        <Card.Text>
          <strong>주차 가능:</strong> {restaurant.parkingAvailable ? '가능' : '불가능'}
        </Card.Text>
        <Card.Text>
          <strong>예약 가능:</strong> {restaurant.reservationAvailable ? '가능' : '불가능'}
        </Card.Text>
        <Card.Text>
          <strong>총 좌석 수:</strong> {restaurant.totalSeats}
        </Card.Text>
        <Card.Text>
          <strong>평균 평점:</strong> {restaurant.averageRating || '없음'}
        </Card.Text>
        <Card.Text>
          <strong>설명:</strong> {restaurant.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard;
