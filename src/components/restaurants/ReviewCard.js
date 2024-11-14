import "../../css/restaurants/ReviewCard.css";
import "../../css/bootstrap.min.css";

function ReviewCard(){
    return(
        <div className="container">
            <div className="reviewMain">
                <div className="reviewBtn">
                    <img src="/foodimg1.jpg"/>
                    <p className="title">가게이름</p>
                    <p className="text">안녕하세용 길고긴 설명을 씁니다 1234564564950823</p>
                </div>
                <div className="reviewBtn">
                    <img src="/foodimg1.jpg"/>
                    <p className="title">가게이름</p>
                    <p className="text">안녕하세용 길고긴 설명을 씁니다 1234564564950823</p>
                </div>
                <div className="reviewBtn">
                    <img src="/foodimg1.jpg"/>
                    <p className="title">가게이름</p>
                    <p className="text">안녕하세용 길고긴 설명을 씁니다 1234564564950823</p>
                </div>
                <div className="reviewBtn">
                    <img src="/foodimg1.jpg"/>
                    <p className="title">가게이름</p>
                    <p className="text">안녕하세용 길고긴 설명을 씁니다 1234564564950823</p>
                </div>
            </div>
            <button className="btn btn-warning">리뷰 더보기</button>
        </div>
    )
}
export default ReviewCard;