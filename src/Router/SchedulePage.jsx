import ManagerSchedule from "../components/KDH/ManagerSchedule"; // ReservationStatus 컴포넌트 임포트
import Header from "../components/Header";
import Footer from "../components/Footer";

// 컴포넌트 이름을 변경하여 충돌을 피함
function SchedulePage() {
    return (
        <>
            <Header />
            <ManagerSchedule /> {/* 예약 상태 컴포넌트를 사용 */}
            <Footer />
        </>
    );
}

export default SchedulePage;
