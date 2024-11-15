import AdminNavbar from "../components/admin/AdminNavbar.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import Dashboard from "../components/admin/Dashboard.jsx";

// 부트스트랩 임포트
function Admin() {
  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <Dashboard />
    </>
  );
}

export default Admin;
