import React from 'react';
import { Button, Form, Nav,  } from 'react-bootstrap';
import '../../css/restaurants/MenuPage.css';
import MenuCard from '../../components/restaurants/MenuCard';

function MenuPage() {
  return (
    <div className="App">
      <div className="container">
        <div className="menuNav">
          <div className="menuNavSearch">
            <Form inline>
              <Form.Control
                type="text"
                className='scInput'
                placeholder='가게 명 검색'
                style={{ width: '80%' }}
              />
              <Button type="submit" className='scBtn btn-warning'>입력</Button>
            </Form>
          </div>
          <Nav className="menuNavList mt-3">
            <Nav.Item>
              <Button variant="outline-warning" className="me-2">한식</Button>
            </Nav.Item>
            <Nav.Item>
              <Button variant="outline-warning" className="me-2">리스트보기</Button>
            </Nav.Item>
            <Nav.Item>
              <Button variant="outline-warning" className="me-2">123</Button>
            </Nav.Item>
          </Nav>
        </div>
      </div>
      <div className="line"></div>
      <MenuCard />
    </div>
  );
}

export default MenuPage;
