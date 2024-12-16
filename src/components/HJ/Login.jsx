import React from 'react';
import '../../css/main.css';
import '../../css/login.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { jwtDecode } from 'jwt-decode';
import restaurantIcon from '../../img/restaurant_icon.png';

function Login() {

  const [login, setLogin] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe,setRememberMe]= useState(false);
  // Zustand 스토어에서 상태 및 액션 가져오기
  const {setToken} = useAuthStore();

  useEffect(() => {
    
  }, []);

  // 로그인 요청 처리
  const handleLogin = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
  
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          userName: username,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.data.success) {
        const token = response.data.data.token;
  
        // 토큰 디코딩 후 상태 업데이트
        const decodeToken = () => {
          const decoded = jwtDecode(token);
  
          // Zustand 상태 업데이트 및 로컬/세션 스토리지 저장
          setToken(token, rememberMe);
  
          if (rememberMe) {
            localStorage.setItem("userId", decoded.userId);
            localStorage.setItem("userName", decoded.sub);
            localStorage.setItem("userRole", decoded.auth);
            localStorage.setItem("restaurantId", decoded.restaurantId);
          } else {
            sessionStorage.setItem("userId", decoded.userId);
            sessionStorage.setItem("userName", decoded.sub);
            sessionStorage.setItem("userRole", decoded.auth);
            sessionStorage.setItem("restaurantId", decoded.restaurantId);
          }
        };
  
        decodeToken();
        alert("로그인에 성공하였습니다.");
        // 페이지 새로 고침 없이 상태를 반영하도록
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
            <img src={restaurantIcon} />
          </div>
          {/* 로그인 페이지 타이틀 */}
          <h2 className='HjLoginTitle'>로그인</h2>

          {/* 로그인 입력칸 */}
          <div className="HjInputBox">
  <input
    type="text"
    id="HjUserName"
    placeholder="아이디를 입력하세요."
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <input
    type="password"
    id="HjPassword"
    placeholder="비밀번호를 입력하세요."
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginBottom:"10px" }}>
      <span>자동 로그인</span>
      <input
        type="checkbox"
        id="rememberMe"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
        style={{ margin:"5px 0px 5px auto" ,width:"5%",height:"16px" }} // 체크박스를 오른쪽으로 밀어냄
      />
    </div>
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