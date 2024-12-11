import { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import 'css/Map.css';
import axios from "axios";
import { restaurantStore } from "store/restaurantStore";

const { sop } = window;

function Map() {
  const { restaurant } = restaurantStore();
  const mapRef = useRef(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const searchmap = () => {
    // 요청할 도시 이름을 변수에 저장
    const address = restaurant.jibunAddr; // 원하는 도시 이름으로 변경

    // axios GET 요청 보내기
    axios.get(`http://localhost:8080/api/map`, {
      params: {
        address: address,  // 쿼리 파라미터에 도시 이름 전달
      }
    })
    .then(response => {
      setX(response.data.result.resultdata[0].x);
      setY(response.data.result.resultdata[0].y);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  useEffect(() => {
    searchmap();
  }, [restaurant.jibunAddr]);  // restaurant.jibunAddr 변경 시마다 호출

  useEffect(() => {
    if (x !== 0 && y !== 0) {
      const map = sop.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      map.setView(sop.utmk(x, y), 11);  // 지도 좌표로 설정

      // 마커 추가
      const marker = new sop.Marker(sop.utmk(x, y));  // 마커 생성
      marker.addTo(map);  // 맵에 마커 추가

      return () => {
        map.remove();  // 컴포넌트 언마운트 시 맵 제거
      };
    }
  }, [x, y]);  // x, y 값이 변경될 때마다 실행

  return (
    <Card id="map" ref={mapRef} style={{ width: '100%', height: '100%' }} />
  );
}

export default Map;