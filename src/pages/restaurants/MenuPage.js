import '../../css/restaurants/MenuPage.css';
import "../../css/bootstrap.min.css";
import MenuCard from '../../components/restaurants/MenuCard';

function MenuPage() {
  return (
    <div className="App">
        <div className="container">
            <div className="menuNav">
                <div className="menuNavSearch">
                <input type="text" className='scInput' placeholder='가게 명 검색'/>
                <button type="submit" className='scBtn btn btn-warning'>입력</button>
                </div>
                <ul className="menuNavList">
                    <li className="btn btn-outline-warning">한식</li>
                    <li className="btn btn-outline-warning">리스트보기</li>
                    <li className="btn btn-outline-warning">123</li>
                </ul>
            </div>
        </div>
        <div className="line"></div>
        <MenuCard/>
    </div>
  );
}

export default MenuPage;
