import Reserve from "./components/Reserve";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./css/App.css";

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="App">
      <Header/>
      <Reserve/>
      <Footer/>
    </div>
  );
}
export default App;