import ReserveMain from "../components/ReserveMain";
import Header from "../components/Header";
import Footer from "../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

// 부트스트랩 임포트
function ReserveMainPage() {
    return (
        <>
        <Header/>
        <ReserveMain/>
        <Footer/>
        </>
    );
  }

export default ReserveMainPage;