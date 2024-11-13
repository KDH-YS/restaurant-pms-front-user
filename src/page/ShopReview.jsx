import "../css/shopReview.css";

export function ShopReview() {
  return (
    <>
    <div className="container">
      <div className="content">
        <div className="shopInfo">
          <img src="https://via.placeholder.com/648x400" alt="" />
          <img src="https://via.placeholder.com/648x400" alt="" />
          <h2>부산한치모밀</h2>
          <p>서울특별시 강동구 올림픽로 682-8 1층 102호</p>
          <p>한치, 모밀</p>
        </div>
        <div className="photoReview">
          <h3>사진/영상 리뷰</h3>
          <img src="https://via.placeholder.com/324x324" alt="" />
          <img src="https://via.placeholder.com/324x324" alt="" />
          <img src="https://via.placeholder.com/324x324" alt="" />
          <img src="https://via.placeholder.com/324x324" alt="" />
          <button class="btn btn-lg btn-prima ry" type="button">Block button</button>
        </div>
        <ul className="review">
          <li>
            <div>
              <h3>리뷰</h3>
              <img src="https://via.placeholder.com/40x40" alt="" />
              <p>리뷰어</p>
              <p>리뷰 20  팔로워 12  팔로잉 2</p>
            </div>
            <div>
              <img src="https://via.placeholder.com/100x100" alt="" />
              <p>리뷰 글 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro cupiditate dolorum similique consequuntur ipsa ducimus, nostrum iure maxime quidem et facilis vero consequatur, harum explicabo eaque</p>
              <p>더보기</p>
              <span>음식이 맛있어요</span><span>특별한 메뉴가 있어요</span><br/>
              <img src="https://via.placeholder.com/40x40" alt="" /><p>반응 남기기</p>
              <p>11.10일  1번째 방문  영수증</p>
            </div>
          </li>
          <div className="line"></div>
          <li>
            <div>
              <h3>리뷰</h3>
              <img src="https://via.placeholder.com/40x40" alt="" />
              <p>리뷰어</p>
              <p>리뷰 20  팔로워 12  팔로잉 2</p>
            </div>
            <div>
              <img src="https://via.placeholder.com/100x100" alt="" />
              <p>리뷰 글 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro cupiditate dolorum similique consequuntur ipsa ducimus, nostrum iure maxime quidem et facilis vero consequatur, harum explicabo eaque</p>
              <p>더보기</p>
              <span>음식이 맛있어요</span><span>특별한 메뉴가 있어요</span><br/>
              <img src="https://via.placeholder.com/40x40" alt="" /><p>반응 남기기</p>
              <p>11.10일  1번째 방문  영수증</p>
            </div>
          </li>
          <button class="btn btn-lg btn-prima ry" type="button">Block button</button>
        </ul>
        <ul className="snsReview">
          <h3>SNS</h3>
          <p>참고 할만한 리뷰들</p>
          <li>
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <img src="https://via.placeholder.com/220x220" alt="" />
            <p>부산한치모밀</p>
            <p>한치, 모밀</p>
          </li>
        </ul>
      </div>
    </div>
    </>
  )
}

export default ShopReview;