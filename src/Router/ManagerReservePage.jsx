import ManagerReserve from "../components/KDH/ManagerReserve"; // ReservationStatus 컴포넌트 임포트
import Header from "../components/Header";
import Footer from "../components/Footer";

// 컴포넌트 이름을 변경하여 충돌을 피함
function ManagerReservePage() {

    
    return (
        <>
            <Header />
            <ManagerReserve /> {/* 예약 상태 컴포넌트를 사용 */}
            <Footer />
        </>
    );
}

export default ManagerReservePage;
