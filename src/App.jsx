import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Router 임포트
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard'
import Footer from './components/Footer';
function App() {
  return (
    <Router> {/* Router로 앱 감싸기 */}
      <div className="wrapper">
        {/* Navbar */}
        <Navbar />

        {/* Sidebar */}
        <Sidebar />
        <Dashboard/>
        
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
