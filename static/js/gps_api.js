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

// 장소 리뷰 가져오기
async function getNearAritcle(location) {
    const response = await fetch(`${back_base_url}/articles/location-articles/?location=${location}`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

// 주변 데이터 맵 형식
async function loadMyPosition(position) {
    // 내 위치 표시
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
    // 마커가 지도 위에 표시되도록 설정
    myMarker.setMap(map);

    // 주변 데이터 표시
    const nearPositions = await getNearPosition(position)
    // 주변 마커 생성
    nearPositions.forEach(point => {
        // 마커를 표시할 위치
        var position = new kakao.maps.LatLng(point.coordinate_y, point.coordinate_x);
        // 마커를 생성
        var marker = new kakao.maps.Marker({
            map: map,
            position: position,
        });
        // 커스텀 오버레이에 표시할 컨텐츠
        var content = '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            `            장소 이름` +
            '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="img">' +
            '                <img src="#" width="73" height="70">' +
            '           </div>' +
            '            <div class="desc">' +
            `                <div class="ellipsis">${point.road_address}</div > ` +
            `                <div class= "jibun ellipsis">(지번) ${point.jibun_address}</div > ` +
            `                <div><a href="#" onclick="loadMyList(${point.id})" class="link">리뷰보기</a></div>` +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>';

        // 마커 위에 커스텀오버레이를 표시
        var overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: map,
            position: marker.getPosition()
        });
        // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
        kakao.maps.event.addListener(marker, 'click', function () {
            overlay.setMap(map);
        });
    });
}
// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    overlay.setMap(null);
}


// 주변 데이터 리스트 형식
async function loadMyList(location) {
    // 리뷰 데이터 가져오기
    const response = await getNearAritcle(location)
    console.log(response)
    const location_list = document.getElementById('location-list')
    location_list.innerHTML = ''
    response.results.forEach(article => {
        location_list.innerHTML += `
        <div class="col" >
        <div class="card text-bg-dark border-light" style="height:300px; justify-content: center;" onclick="location.href='${front_base_url}/index.html';">
        <img src="${article.images}" class="card-img cardimg mh-100" alt="..." >
        <div class="card-img-overlay img-cover p-4">
        <h5 class="card-title">${article.title}</h5>
        <p class="card-text content">${article.content}</p>
        <p class="card-text"><small>${article.user} | ${article.created_at}</small></p>
        </div>
        </div>
        </div>
        `
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