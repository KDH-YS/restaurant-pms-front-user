import React from 'react';
import { Link } from 'react-router-dom'; // React Router를 사용하여 페이지 이동을 처리
import { Nav, NavItem, NavLink, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome 아이콘을 사용하기 위한 라이브러리

const AdminSidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* 브랜드 링크 */}
      <a href="/" className="brand-link">
        <img
          src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
        />
        <span className="brand-text font-weight-light">AdminLTE</span>
      </a>

      <div className="sidebar">
        {/* 사용자 패널 */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div>
            <img
              src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User"
            />
          </div>
          <div className="info">
            <Link to="/" className="d-block">User Name</Link>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <Nav defaultActiveKey="/" className="flex-column">
          {/* 회원 관리 */}
          <NavItem>
            <NavLink as={Link} to="/manage-users">
              <FontAwesomeIcon icon="users" />
              <p>회원 관리</p>
            </NavLink>
          </NavItem>
          {/* 레스토랑 관리 */}
          <NavItem>
            <NavLink as={Link} to="/manage-restaurants">
              <FontAwesomeIcon icon="store" />
              <p>레스토랑 관리</p>
            </NavLink>
          </NavItem>
          {/* 예약 관리 */}
          <NavItem>
            <NavLink as={Link} to="/manage-reservations">
              <FontAwesomeIcon icon="calendar-check" />
              <p>예약 관리</p>
            </NavLink>
          </NavItem>
          {/* 리뷰 관리 */}
          <NavItem>
            <NavLink as={Link} to="/manage-reviews">
              <FontAwesomeIcon icon="comments" />
              <p>리뷰 관리</p>
            </NavLink>
          </NavItem>
        </Nav>

        {/* 추가 사이드바 메뉴 */}
        <Nav defaultActiveKey="/" className="flex-column">
          {/* 대시보드 */}
          <NavItem>
            <NavLink as={Link} to="/dashboard">
              <FontAwesomeIcon icon="tachometer-alt" />
              <p>대시보드</p>
            </NavLink>
          </NavItem>
          {/* 위젯 */}
          <NavItem>
            <NavLink as={Link} to="/widgets">
              <FontAwesomeIcon icon="th" />
              <p>위젯</p>
            </NavLink>
          </NavItem>
          {/* 레이아웃 옵션 */}
          <NavItem>
            <NavLink eventKey="/layout-options" as={Link}>
              <FontAwesomeIcon icon="cogs" />
              <p>레이아웃 옵션</p>
            </NavLink>
            <Collapse in={true}>
              <div>
                <Nav>
                  <NavItem>
                    <NavLink as={Link} to="/layout-top-nav">
                      <FontAwesomeIcon icon="circle" />
                      <p>상단 네비게이션</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink as={Link} to="/layout-boxed">
                      <FontAwesomeIcon icon="circle" />
                      <p>박스형</p>
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            </Collapse>
          </NavItem>
        </Nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
