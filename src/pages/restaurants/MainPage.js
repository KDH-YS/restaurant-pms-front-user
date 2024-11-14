import '../../css/restaurants/MainPage.css';
import ReviewCard from '../../components/restaurants/ReviewCard.js';
// import "../css/bootstrap.min.css";

function MainPage() {
  return (
    <div className="App">
      {/* <Image/> */}
        <div className="imageContainer">
            <div className="image">
            <img src="/foodimg1.jpg"/>
            <div className="searchBtn">
                <input type="text" className='scInput' placeholder='가게 명 검색'/>
                <button type="submit" className='scBtn btn btn-warning'>입력</button>
            </div>
            </div>
        </div>
      <div className='container'>
      <h1 className='reviewHd'>Review</h1>
      <ReviewCard/>
      <h1 className='reviewHd'>magazine</h1>
      {/* <Review/> */}
      </div>
    </div>
  );
}

export default MainPage;
