import React from "react";
import "../css/main.css";
import "../css/myreview.css";

export function MyReview() {
  return(
    <>
    <div className="container">
      <div className="myReview">
        <h3>내 리뷰</h3>
          <ul>
            <li>
              <img src="https://via.placeholder.com/300x360" alt="" />
              <div>
                <p>맛있어요</p>
                <p>서울특별시 강동구 천호동</p>
                <p>부산한치모밀</p>
              </div>
            </li>
            <li><img src="https://via.placeholder.com/300x360" alt="" /></li>
            <li><img src="https://via.placeholder.com/300x360" alt="" /></li>
            <li><img src="https://via.placeholder.com/300x360" alt="" /></li>
          </ul>
        <button class="btn btn-lg btn-prima ry" type="button">Block button</button>
      </div>
    </div>
    </>
  )
}

export default MyReview;