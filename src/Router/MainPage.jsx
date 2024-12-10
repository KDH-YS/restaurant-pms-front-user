
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../pages/restaurants/Main";
// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function MainPage() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default MainPage;
