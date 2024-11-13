import "../css/shopReview.css";

export function ShopReview() {
  return (
    <>
    <div className="container">
      <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarColor01">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link active" href="#">Home
                  <span class="visually-hidden">(current)</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Features</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Pricing</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">About</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Separated link</a>
                </div>
              </li>
            </ul>
            <form class="d-flex">
              <input class="form-control me-sm-2" type="search" placeholder="Search"/>
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
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