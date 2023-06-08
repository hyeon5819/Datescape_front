async function getAddress(position) {
    // kakao api를 이용해서 좌표를 주소로 바꿔주기
    // https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}&input_coord=WGS84`, {
        method: 'GET',
        headers: {
            'Authorization': `KakaoAK ${REST_API_KEY}`
        },
    })
    const response_json = await response.json()
    //console.log(response_json.documents[0].address.address_name)
    //html에 위치 띄우기
    const mylocation = document.getElementById('mylocation')
    mylocation.innerText = response_json.documents[0].address.address_name
}

// 근처 데이터 가져오기
async function getNearPosition(position) {
    const response = await fetch(`${back_base_url}/articles/location-list?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

// 주변 데이터 맵 형식
async function loadMyPosition(position) {
    // 내 위치 표시하기
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude), //지도의 중심좌표.(위도,경도)
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    // 마커 위치 설정
    var myPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // 마커 생성
    var myMarker = new kakao.maps.Marker({
        position: myPosition
    });
    // 마커가 지도 위에 표시되도록 설정합니다
    myMarker.setMap(map);

    // 주변 데이터 표시하기
    const nearPositions = await getNearPosition(position)
    // 주변 마커 생성
    nearPositions.forEach(point => {
        console.log(point)
        console.log(point.coordinate_x)
        // 마커를 표시할 위치입니다 
        var position = new kakao.maps.LatLng(point.coordinate_y, point.coordinate_x);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: position,
        });
        // 마커를 지도 위에 표시
        marker.setMap(map);

    });
}

// 주변 데이터 리스트 형식
async function loadMyList(position) {
    // 주변 데이터 가져오기
    const nearPositions = await getNearPosition(position)
    console.log(nearPositions)

    nearPositions.forEach(point => {
        console.log(point)
        // 리스트 카드 생성

    });
}


// 위치 오류 함수
function locationError() {
    alert("위치 권한을 확인해주세요");
}

// 위치 옵션
const locationOption = {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: 5000
}





window.onload = async function () {
    if (navigator.geolocation) { // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(getAddress, locationError, locationOption)
        navigator.geolocation.getCurrentPosition(loadMyPosition, locationError, locationOption)
    } else {
        alert('GPS를 지원하지 않습니다');
    }

}