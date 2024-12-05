import React from 'react';
import menubuger from "../img/menubuger.png"
import '../css/Header.css'
import {Link} from "react-router-dom";
import { useAuthStore } from '../store/authStore';

export function Header() {

    const { token, userName, clearAuth } = useAuthStore();

    const handleLogout = () => {
        clearAuth(); // Zustand 상태 초기화
        localStorage.removeItem("token"); // 로컬 스토리지에서도 제거
        alert("로그아웃되었습니다.");
    };
    console.log(token); // 상태 확인용 로그

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* 중앙에 Rechelin Korea 텍스트 */}
                <Link className="navbar-brand mx-auto" to="/">Rechelin Korea</Link>

                {/* 오른쪽 끝에 드롭다운 메뉴 */}
                <div className="dropdown">
                    <button className="btn" data-bs-toggle="dropdown">
                        <img src={menubuger}/>
                    </button>

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {token ? (
                            <div>
                                <p>{userName}님 환영합니다.</p>
                                <li className="dropdown-item" onClick={handleLogout}>로그아웃</li>
                                <li><Link className="dropdown-item" to="/MyPage">마이페이지</Link></li>
                            </div>
                        ) : (
                            <>
                                <li><Link className="dropdown-item" to="/login">로그인</Link></li>
                                <li><Link className="dropdown-item" to="/signup">회원가입</Link></li>
                            </>
                        )}
                        <li><Link className="dropdown-item" to="/inquiry">문의하기</Link></li>
                        <li><Link className="dropdown-item" to="/restaurant">레스토랑</Link></li>
                        <li><Link className="dropdown-item" to="/admin">관리자 페이지</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
