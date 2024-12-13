import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navbar, Dropdown, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'; // jwt-decode 모듈을 가져옵니다.
import styled from 'styled-components';
import menubuger from 'img/menubuger.png'

const CustomDropdownToggle = styled(Dropdown.Toggle)`
    &::after {
        display: none;
    }
`;

const CustomDropdownMenu = styled(Dropdown.Menu)`
    left: -100px !important; // 메뉴 위치 조정
`;

export function Header() {
    const { token, userName, clearAuth,userRole } = useAuthStore();
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
    }, [token]); // token이 변경될 때만 실행

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
        window.location.href = "/"; // 메인페이지로 이동
    };


    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
                {/* 중앙에 Rechelin Korea 텍스트 */}
                <Navbar.Brand className="mx-auto" as={Link} to="/">Rechelin Korea</Navbar.Brand>
                {/* 드롭다운 메뉴 */}
                <Dropdown>
                    <CustomDropdownToggle drop="start" variant="link">
                        <img src={menubuger} alt="메뉴 아이콘" />
                    </CustomDropdownToggle>

                    <CustomDropdownMenu>
                        {token ? (
                            <>
                                <Dropdown.ItemText>{userName}님 환영합니다.</Dropdown.ItemText>
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

                        <Dropdown.Divider />

                        {/* restaurantId가 존재할 경우 레스토랑 관련 메뉴 추가 */}
                        {restaurantId && (
                            <>
                                <Dropdown.Item as={Link} to="/manager/schedule">레스토랑 스케줄</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/manager/reserve">레스토랑 예약현황</Dropdown.Item>
                            </>
                        )}

                        <Dropdown.Divider />

                        {token && userRole=='ROLE_ADMIN' && (
                            <Dropdown.Item as={Link} to="/admin">관리자 페이지</Dropdown.Item>
                        )}  
                    </CustomDropdownMenu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

export default Header;
