import Navbar from "./components/admin/Navbar.jsx";
import Sidebar from "./components/admin/Sidebar.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";

// 부트스트랩 임포트
function Admin() {
    return (
        <>
        <Navbar/>
        <Sidebar/>
        <Dashboard/>
        </>
    );
  }

export default Admin;