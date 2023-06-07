
function getLocation() {
    if (navigator.geolocation) { // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(async function (position) {
            // kakao api를 이용해서 좌표를 주소로 바꿔주기
            // https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
            const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}&input_coord=WGS84`, {
                method: 'GET',
                headers: {
                    'Authorization': `KakaoAK ${REST_API_KEY}`
                },
            })
            const response_json = await response.json()
            console.log(response_json.documents[0].address.address_name)
        }, function (error) {
            // 에러 메세지 확인
            console.error(error);
        }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert('GPS를 지원하지 않습니다');
    }
}



getLocation();