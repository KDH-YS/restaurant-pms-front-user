import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navbar, Dropdown, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Header.css'; // CSS 파일 import

export function Header() {
    const { token, name, clearAuth, userRole } = useAuthStore();

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
        window.location.href = "/";
    };
    // 관리자 페이지 이동시 토큰 url로 보내기
    const handleExternalLink = () => {
        const token =  localStorage.getItem('token') || sessionStorage.getItem('token') || null; // 세션에서 토큰 가져오기
        const externalUrl = `http://localhost:3000?token=${encodeURIComponent(token)}`;
        window.location.href = externalUrl; // 외부 URL로 리디렉션
      };
    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
                {/* 중앙에 Rechelin Korea 텍스트 */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src="/img/restaurant_icon.png" alt="로고" />
                    Rechelin Korea
                </Navbar.Brand>

                {/* 햄버거 메뉴를 오른쪽으로 정렬 */}
                <Dropdown className="ms-auto">
                    <Dropdown.Toggle variant="link" className="custom-dropdown-toggle">
                        <img src="/icons/bars-white.svg" alt="메뉴 아이콘" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu">
                        {token ? (
                            <>
                                <Dropdown.ItemText>{name}님 환영합니다.</Dropdown.ItemText>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/MyPage">마이페이지</Dropdown.Item>
                            </>
                        ) : (
                            <>
                                <Dropdown.Item as={Link} to="/login">로그인</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/signup">회원가입</Dropdown.Item>
                            </>
                        )}
                        <Dropdown.Item as={Link} to="/restaurant">레스토랑</Dropdown.Item>

                        {userRole && userRole.split(',').includes('ROLE_OWNER') && (
                            <>
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} to="/manager/schedule">레스토랑 스케줄</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/manager/reserve">레스토랑 예약현황</Dropdown.Item>
                            </>
                        )}

                        {token && userRole && userRole.split(',').includes('ROLE_ADMIN') && (
                            <>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleExternalLink}>관리자 페이지</Dropdown.Item>
                            </>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

export default Header;
