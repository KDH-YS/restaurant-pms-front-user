import React from 'react';
import '../css/main.css';
import '../css/login.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

function Login() {

  const [login, setLogin] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Zustand 스토어에서 상태 및 액션 가져오기
  const setToken = useAuthStore((state) => state.setToken);
  const setUserName = useAuthStore((state) => state.setUserName);
  const setUserRole = useAuthStore((state) => state.setUserRole);

  useEffect(() => {
    
  }, []);

  // 로그인 요청 처리
  const handleLogin = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    console.log("Sending login request with:", { userName: username, password: password }); // 입력 확인용 로그
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        userName: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 보내도록 설정
        },
      }
    );
      if (response.data.success) {
        const token = response.data.data.token; // 서버에서 받은 JWT 토큰
        const userName = response.data.data.userName; // 서버에서 받은 사용자 이름
        const userRole = response.data.data.authorities; // 서버에서 받은 사용자 권한

        // Zustand 스토어에 저장
        console.log(userRole);
        setToken(token);
        setUserName(userName);
        setUserRole(userRole);

        // 로컬 스토리지에도 저장 (선택 사항)
        localStorage.setItem("token", token);

        alert("로그인에 성공하였습니다.");
        window.location.href = "http://localhost:3000"; // 홈 페이지로 이동
      } else {
        setError("아이디 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="HjLogin">
      <div className='HjLoginContent'>
        <form className='HjLoginForm'>
          {/* 로고 */}
          <div className='HjLoginFormLogo'>
            <img src='/restaurant_icon.png' />
          </div>
          {/* 로그인 페이지 타이틀 */}
          <h2 className='HjLoginTitle'>로그인</h2>

          {/* 로그인 입력칸 */}
          <div className='HjInputBox'>
              <input 
                type='text' 
                id='HjUserName' 
                placeholder='아이디를 입력하세요.'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input 
                type='password' 
                id='HjPassword' 
                placeholder='비밀번호를 입력하세요.'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          </div>
          {/* 로그인 버튼 */}
          <button 
          type='submit' 
          className='HjLoginButton'
          onClick={handleLogin}
          >
            로그인
          </button>

          {/* 로그인창 하단 네비(가로 정렬, li와 li 사이에 '|' 삽입) */}
          <ul className='HjLoginNav'>
            <li className='HjLoginNavList'>
              <Link to="/Signup">회원가입</Link>
            </li>
            <li className='HjLoginNavList'>아이디 찾기</li>
            <li className='HjLoginNavList'>비밀번호 찾기</li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default Login;