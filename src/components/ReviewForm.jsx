import React from "react";

export function ReviewForm() {
  return (
    <>
    <div className="container">
      <div className="formShop">
        <p>한치, 모밀</p>
        <h3>부산한치모밀</h3>
        <p>2024년 11월 10일에 방문했어요.</p>
        <img src="" alt="별점" />
        <p>(10명의 평기)</p>
      </div>
      <div className="menuReview">
        <h3>메뉴</h3>
        <p>한치모밀中(1~2일)</p>
        <p>계란찜</p>
        <p>맥주</p>
        <p>28,000원</p>
        <p>2,000원</p>
        <p>4,000원</p>
        <div className="line"></div>
        <p>총 금액</p>
        <p>34,000원</p>
      </div>
      <div className="keyWord">
        <img src="" alt="맛있어요" />
        <img src="" alt="친절해요" />
        <img src="" alt="특별한 메뉴가 있어요" />
        <img src="" alt="주차하기 편해요" />
      </div>
      <div className="reviewForm">
        <form action="">
          <div>
            <label for="formFile" class="form-label mt-4">이미지 업로드</label>
            <input class="form-control" type="file" id="formFile" />
            <img src="" alt="예시1" />
            <img src="" alt="예시2" />
            <img src="" alt="예시3" />
          </div>
          <div>
            <label for="exampleTextarea" class="form-label mt-4">Comment</label>
            <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
          </div>
          <button class="btn btn-lg btn-prima ry" type="button">Block button</button>
        </form>
      </div>
      

    </div>
    </>
  )
}

export default ReviewForm;