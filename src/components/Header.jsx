import React from 'react';
import menubuger from "../img/menubuger.png"
import '../css/Header.css'

function Header() {
  return (
    <nav className="navbar navbar-expand-lg" data-bs-theme="dark" >
      <div className="container-fluid" >
        {/* 중앙에 Rechelin Korea 텍스트 */}
        <a className="navbar-brand mx-auto" >Rechelin Korea</a>

        {/* 오른쪽 끝에 드롭다운 메뉴 */}
        <div className="dropdown" >
          <button className="btn" data-bs-toggle="dropdown">
          <img src={menubuger} />
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" >Action</a></li>
            <li><a className="dropdown-item" >Another action</a></li>
            <li><a className="dropdown-item" >Something else here</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
