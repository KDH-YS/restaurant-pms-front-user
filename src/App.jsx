import ReserveMain from "./components/ReserveMain";
import Header from "./components/Header";
import Footer from "./components/Footer"

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="App">
      <Header/>
      <ReserveMain/>
      <Footer/>
    </div>
  );
}
export default App;