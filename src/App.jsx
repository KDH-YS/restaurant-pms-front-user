import ReserveMain from "./components/ReserveMain";
import Header from "./components/Header";
import Footer from "./components/Footer"
import MainPage from "./pages/restaurants/MainPage.js"

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="App">
      <Header/>
      <MainPage/>
      <Footer/>
    </div>
  );
}
export default App;