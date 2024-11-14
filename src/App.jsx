import Admin from "./Admin.jsx";
import User from "./User.jsx"
// 부트스트랩 임포트
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<User />} />
                    <Route path="/Admin" element={<Admin/>}/>
                </Routes>
            </div>
        </BrowserRouter>

        
    );
  }

export default App;