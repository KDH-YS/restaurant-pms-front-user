import React from 'react';
import menubuger from "../img/menubuger.png";
import { Link } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import { Navbar, Dropdown, Container } from 'react-bootstrap';
import styled from 'styled-components';

const CustomDropdownToggle = styled(Dropdown.Toggle)`

&::after {
  display:none;
}
`;
const CustomDropdownMenu = styled(Dropdown.Menu)`
left: -100px !important;  // 메뉴 위치 조정
`;
export function Header() {
    const { token, userName, clearAuth } = useAuthStore();


    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
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
                                <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/MyPage">마이페이지</Dropdown.Item>
                            </>
                        ) : (
                            <>
                                <Dropdown.Item as={Link} to="/login">로그인</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/signup">회원가입</Dropdown.Item>
                            </>
                        )}
                        <Dropdown.Item as={Link} to="/inquiry">문의하기</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/restaurant">레스토랑</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin">관리자 페이지</Dropdown.Item>
                    </CustomDropdownMenu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

export default Header;
