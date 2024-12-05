import React from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import '../../css/restaurants/MainPage.css';
import ReviewCard from '../../components/restaurants/ReviewCard.js';

function MainPage() {
  return (
    <div className="App">
      <div className="imageContainer">
        <div className="image">
          <img src="/img/foodimg1.jpg" alt="Food" className="img-fluid" />
          <div className="searchBtn">
            <Form className="d-flex">
              <Form.Control
                type="text"
                className='scInput'
                placeholder='가게 명 검색'
                style={{ width: '80%' }}
              />
              <Button type="submit" className='scBtn btn-warning ms-2'>입력</Button>
            </Form>
          </div>
        </div>
      </div>

      <Container>
        <h1 className='reviewHd mt-4'>Review</h1>
        <ReviewCard />

        <h1 className='reviewHd mt-4'>Magazine</h1>
        {/* <Review/> */}
      </Container>
    </div>
  );
}

export default MainPage;
