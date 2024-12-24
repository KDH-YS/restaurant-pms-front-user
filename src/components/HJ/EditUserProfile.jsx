import React, { useEffect, useState } from "react";
import '../../css/signup.css';
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import baseUrlStore from "store/baseUrlStore";

function EditUserProfile() {
const {token,userId}=useAuthStore();
const {apiUrl} = baseUrlStore();
  // 입력 값 상태
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    email: "",
    phone: "",
  });



  // 초기 사용자 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/me/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("응답 데이터:", response.data); // 응답 데이터를 확인합니다.

        // 데이터가 오면 바로 성공 처리
        const { userName, name, email, phone } = response.data;
        setFormData({ userName, name, email, phone });
      } catch (error) {
        console.error("사용자 정보 로드 중 오류:", error);
        alert("사용자 정보를 불러오는데 오류가 발생했습니다.");
      }
    };

    fetchUserData();
  }, [token, userId]);

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

// 사용자 정보 수정 요청
const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.put(
      `${apiUrl}/api/users/me/editProfile/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 성공 메시지 출력
    alert("정보가 성공적으로 수정되었습니다.");
    window.location.href = "/mypage"; // 홈 페이지로 이동
  } catch (error) {
    console.error("정보 수정 중 오류:", error);
    alert("정보 수정 중 오류가 발생했습니다.");
  }
};


  return (
    <div className="HjSignup">
      <div className="HjSignupContent">
        <form className="HjSignupForm" onSubmit={handleUpdate}>
          <h2>정보 수정</h2>
          <br />
          <div className="HjSignupLabelContainer">
            <label htmlFor="userName" className="HjSignupLabel">아이디:</label>
            <input
              type="text"
              id="userName"
              value={formData.userName}
              onChange={handleInputChange}
              autoComplete="off"
              disabled // 아이디는 수정 불가능
            />
            <br />

            <label htmlFor="name" className="HjSignupLabel">닉네임:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <br />

            <label htmlFor="email" className="HjSignupLabel">이메일:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="off"
              disabled
            />
            <br />

            <label htmlFor="phone" className="HjSignupLabel">휴대폰 번호:</label>
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <button type="submit" className="HjSignupBtn">정보 수정</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserProfile;
