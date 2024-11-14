import React from 'react';
import menubuger from "../img/menubuger.png"
import '../css/Header.css'
import {Link} from "react-router-dom";

function Header() {
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
                        <li><Link className="dropdown-item" to="/login">로그인</Link></li>
                        <li><Link className="dropdown-item" to="/signup">회원가입</Link></li>
                        <li><Link className="dropdown-item" to="/restaurant">레스토랑</Link></li>
                        <li><Link className="dropdown-item" to="/review">리뷰하기</Link></li>
                        <li><Link className="dropdown-item" to="/contact-us">문의하기</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
