import Header from "../components/Header";
import Footer from "../components/Footer";
import RestaurantInfo from "../components/RestaurantsInfo"
// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Restaurant() {
  return (
    <>
      <Header />
      <RestaurantInfo/>
      <Footer />
    </>
  );
}

export default Restaurant;
