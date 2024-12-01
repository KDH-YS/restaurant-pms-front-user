import React from "react";

function Signup() {
  return (
    <div className="HjSignup">
      <div className="HjSignupContent">
        <form className="HjSignupForm" action="">
          <h2>회원가입</h2>
          <br />
          <label htmlFor="HjSignupInputId" className="HjSignupLabel">아이디:</label>
          <input type="text" name="userName" id="HjSignupInputId" placeholder="아이디를 입력하세요" />
          <br />
          <label htmlFor="HjSignupInputPassword" className="HjSignupLabel">비밀번호:</label>
          <input type="password" name="password" id="HjSignupInputPassword" placeholder="비밀번호를 입력하세요" />
          <br />
          <label htmlFor="HjSignupInputName" className="HjSignupLabel">이름:</label>
          <input type="text" name="name" id="HjSignupInputName" placeholder="이름을 입력하세요" />
          <br />
          <label htmlFor="HjSignupInputEmail" className="HjSignupLabel">이메일:</label>
          <input type="email" name="email" id="HjSignupInputEmail" placeholder="이메일을 입력하세요" />
          <br />
          <label htmlFor="HjSignupInputPhone" className="HjSignupLabel">휴대폰 번호:</label>
          <input type="text" name="phone" id="HjSignupInputPhone" placeholder="예: 010-1234-5678" />
          <br />
          <label htmlFor="HjSignupInputNotificationAgreed" className="HjSignupLabel">알림 수신 동의</label>
          <input type="checkbox" name="notificationAgreed" id="HjSignupInputNotificationAgreed" />

        </form>
      </div>
    </div>
  );
}

export default Signup;