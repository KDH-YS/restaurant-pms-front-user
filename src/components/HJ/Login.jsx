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
  const {setUserId,setToken,setUserName,setUserRole,userId} = useAuthStore();

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
        const userId = jwtDecode(token).userId;
        const userName = response.data.data.userName;
        const userRole = jwtDecode(token).auth;
  
        // Zustand에 저장 (자동 로그인 여부에 따라)
        setToken(token, rememberMe); // rememberMe 값에 따라 로컬 또는 세션 스토리지에 저장
        setUserName(userName,rememberMe);
        setUserRole(userRole, rememberMe); // userRole 저장 추가
        console.log(userRole);
        // 상태가 모두 저장된 후에 리다이렉트
        setTimeout(() => {
          alert("로그인에 성공하였습니다.");
          window.location.href = "http://localhost:3000"; // 홈 페이지로 이동
        }, 100); // 약간의 딜레이를 추가
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