import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navbar, Dropdown, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import menubuger from 'img/menubuger.png';
import '../css/Header.css'; // CSS 파일 import

export function Header() {
    const { token, name, clearAuth,userRole } = useAuthStore();
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRestaurantId(decodedToken.restaurantId);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, [token]);

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
        window.location.href = "/";
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
                        <Dropdown.Item as={Link} to="/inquiry">문의하기</Dropdown.Item>

                        {restaurantId && (
                            <>
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} to="/manager/schedule">레스토랑 스케줄</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/manager/reserve">레스토랑 예약현황</Dropdown.Item>
                            </>
                        )}

                        {token && userRole === 'ROLE_ADMIN' && (
                            <>
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} to="/admin">관리자 페이지</Dropdown.Item>
                            </>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

export default Header;
