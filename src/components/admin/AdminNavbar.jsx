import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUtensils, faClipboardList, faStar, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" className="main-header">
      {/* Left navbar links */}
      <Navbar.Toggle aria-controls="basic-navbar-nav">
        <FontAwesomeIcon icon={faBars} />
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#">Dashboard</Nav.Link>
        </Nav>

        {/* Right navbar links */}
        <Nav className="ml-auto">
          {/* Navbar Search */}
          <Nav.Item>
            <Nav.Link href="#" onClick={handleSearchToggle}>
              <FontAwesomeIcon icon={faSearch} />
            </Nav.Link>
            {isSearchActive && (
              <Form inline onSubmit={handleSearchSubmit}>
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="mr-sm-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button variant="outline-success" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
                <Button variant="outline-danger" onClick={handleSearchToggle}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </Form>
            )}
          </Nav.Item>

          {/* Member Management */}
          <Nav.Item>
            <Nav.Link href="/member-management">
              <FontAwesomeIcon icon={faUser} />
              <span className="nav-link-text">회원 관리</span>
            </Nav.Link>
          </Nav.Item>

          {/* Restaurant Management */}
          <Nav.Item>
            <Nav.Link href="/restaurant-management">
              <FontAwesomeIcon icon={faUtensils} />
              <span className="nav-link-text">레스토랑 관리</span>
            </Nav.Link>
          </Nav.Item>

          {/* Reservation Management */}
          <Nav.Item>
            <Nav.Link href="/reservation-management">
              <FontAwesomeIcon icon={faClipboardList} />
              <span className="nav-link-text">예약 관리</span>
            </Nav.Link>
          </Nav.Item>

          {/* Review Management */}
          <Nav.Item>
            <Nav.Link href="/review-management">
              <FontAwesomeIcon icon={faStar} />
              <span className="nav-link-text">리뷰 관리</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminNavbar;
