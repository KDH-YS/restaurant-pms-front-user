import React from 'react';

function Login() {
  return (
    <div className='HjLogin'>
      <div className='HjLoginContent'>
        <form className='HjLoginForm'>
          {/* 로고 들어갈 곳(삭제해도 무관) */}
          <img src='#'/>
          {/* 로그인 페이지 타이틀 */}
          <h2 className='HjLoginTitle'>Login Page</h2>

          {/* 로그인 입력칸 */}
          <div className='HjInputBox'>
            <p className='HjInputEmail'>
              아이디 : 
              <input type='email' id='HjEmail' placeholder='이메일을 입력하세요.'/>
            </p>
            <p className='HjInputPassword'>
              비밀번호 : 
              <input type='password' id='HjPassword' placeholder='비밀번호를 입력하세요.'/>
            </p>
          </div>
          {/* 로그인 버튼 */}
          <button type='submit' className='HjLoginButton'>로그인</button>

          {/* 로그인창 하단 네비(가로 정렬, li와 li 사이에 '|' 삽입) */}
          <ul className='HjLoginNav'>
            <li className='HjLoginNavList'>회원가입</li>
            <li className='HjLoginNavList'>아이디/비밀번호 찾기</li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default Login;