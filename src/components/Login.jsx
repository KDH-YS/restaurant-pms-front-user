import React from 'react';
import '../css/main.css';
import '../css/login.css';

function Login() {
  return (
    <div className='HjLoginContent'>
      <form className='HjLoginForm'>
        {/* 로고 들어갈 곳(삭제해도 무관) */}
        <img src='#' className='HjLoginFormLogo'/>
        {/* 로그인 페이지 타이틀 */}
        <h2 className='HjLoginTitle'>로그인</h2>

        {/* 로그인 입력칸 */}
        <div className='HjInputBox'>
            <input type='email' id='HjEmail' placeholder='아이디를 입력하세요.'/>
            <input type='password' id='HjPassword' placeholder='비밀번호를 입력하세요.'/>
        </div>
        {/* 로그인 버튼 */}
        <button type='submit' className='HjLoginButton'>로그인</button>

        {/* 로그인창 하단 네비(가로 정렬, li와 li 사이에 '|' 삽입) */}
        <ul className='HjLoginNav'>
          <li className='HjLoginNavList'>회원가입</li>
          <li className='HjLoginNavList'>아이디 찾기</li>
          <li className='HjLoginNavList'>비밀번호 찾기</li>
        </ul>
      </form>
    </div>
  );
}

export default Login;