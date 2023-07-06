const urlParams = new URLSearchParams(window.location.search);
let dist = urlParams.get("dist");

if (dist == null) {
    document.getElementById('dist').innerHTML = `반경 2km`
} else {
    document.getElementById('dist').innerHTML = `반경 ${dist}km`
}

// 주변 데이터 맵 형식
async function loadMyPosition(position) {
    // 내 위치 표시
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    if (dist == 10) {
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude), //지도의 중심좌표.(위도,경도)
            level: 9 //지도의 레벨(확대, 축소 정도)
        };
    } else if (dist == 5) {
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude), //지도의 중심좌표.(위도,경도)
            level: 7 //지도의 레벨(확대, 축소 정도)
        }
    } else {
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude), //지도의 중심좌표.(위도,경도)
            level: 6 //지도의 레벨(확대, 축소 정도)
        }
    }
    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴



    // 내위치 마커 이미지
    var imageSrc = '../static/images/mymarker@3x.png', // 마커이미지의 주소입니다    
        imageSize = new kakao.maps.Size(55, 55), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(27, 55) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
        // 마커 위치 설정
        myPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);

    // 마커 생성
    var myMarker = new kakao.maps.Marker({
        position: myPosition,
        clickable: true,
        image: markerImage // 마커이미지 설정 
    });
    // 마커가 지도 위에 표시되도록 설정
    myMarker.setMap(map);

    // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성
    var iwContent = '<div style="padding:5px;">내 위치!</div>',
        iwRemoveable = true;

    var infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(myMarker, 'click', function () {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, myMarker);
    });

    // 찾을 반경 설정
    if (dist == null) {
        dist = '2'
    }
    // 주변 데이터 요청
    const nearPositions = await getNearPosition(position.coords.latitude, position.coords.longitude, dist)

    // 주변 마커 생성
    nearPositions.forEach(point => {
        var jibun = point.articles[0].jibun_address
        var placeName = jibun.split(' ')
        // 마커를 표시할 위치
        var position = new kakao.maps.LatLng(point.coordinate_y, point.coordinate_x);
        // 마커를 생성
        var marker = new kakao.maps.Marker({
            map: map,
            position: position,
        });
        // 커스텀 오버레이에 표시할 컨텐츠
        var content = document.createElement('div')
        content.setAttribute("class", "wrap")
        var info = document.createElement('div')
        info.setAttribute("class", "info")
        content.appendChild(info)
        var title = document.createElement('div')
        title.setAttribute("class", "title")
        title.innerHTML = placeName.slice(-1)
        var close = document.createElement('div')
        close.setAttribute("class", "close")
        close.setAttribute("title", "닫기")
        close.onclick = function () { overlay.setMap(null); };
        title.appendChild(close)
        info.appendChild(title)
        var body = document.createElement('div')
        body.setAttribute("class", "body")
        var img = document.createElement('div')
        img.setAttribute("class", "img card")
        var newImg = document.createElement("img")
        newImg.setAttribute("class", "cardimg")
        newImg.setAttribute("src", `${image_url}${point.articles[0].main_image}`)
        newImg.style.cssText = 'width: 73; height:70;';
        img.appendChild(newImg)
        body.appendChild(img)
        var desc = document.createElement('div')
        desc.setAttribute("class", "desc")
        var ellipsis = document.createElement('div')
        ellipsis.setAttribute("class", "ellipsis")
        ellipsis.innerHTML = point.road_address
        desc.appendChild(ellipsis)
        var jibun = document.createElement('div')
        jibun.setAttribute("class", "jibun ellipsis")
        jibun.innerHTML = `(지번) ${point.jibun_address}`
        desc.appendChild(jibun)
        var link = document.createElement('div')
        link.setAttribute("class", "clearfix")
        var score = document.createElement('em')
        score.innerText = point.score_avg
        link.appendChild(score)
        var span = document.createElement('span')
        span.setAttribute("class", "mx-1")
        span.setAttribute("style", "color: #9F9F9F;")
        span.innerText = '|'
        link.appendChild(span)
        var link_a = document.createElement('a')
        link_a.setAttribute("class", "link")
        link_a.setAttribute("onclick", `loadMyList(${point.id})`)
        link_a.setAttribute("href", "#")
        link_a.innerHTML = `리뷰 ${point.articles.length}`
        link.appendChild(link_a)
        desc.appendChild(link)
        body.appendChild(desc)
        info.appendChild(body)

        // 마커 위에 커스텀오버레이를 표시
        var overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: map,
            position: marker.getPosition()
        });
        overlay.setMap(null)
        // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
        kakao.maps.event.addListener(marker, 'click', function () { overlay.setMap(map); });
    });
}
// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    overlay.setMap(null)
}


// 주변 데이터 리스트 형식
async function loadMyList(location) {
    // 리뷰 데이터 가져오기
    const response = await getNearAritcle(location)
    const location_list = document.getElementById('location-list')
    location_list.innerHTML = ''
    response.results.forEach(article => {
        var jibun = article.jibun_address
        var place = jibun.split(' ')
        location_listHTML = `
        <div class="col" >
        <div class="card text-bg-dark border-light rounded-4" style="height:300px; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}&/';">
        <img src="${article.main_image}" class="card-img cardimg mh-100 rounded-4" alt="..." >
        <div class="card-img-overlay img-cover rounded-4" style="padding: 30px;">
        <h4 class="card-title cardtitle mt-3" id="article-title-${article.id}"></h4>
        <p class="card-text content mb-5" id="article-${article.id}"></p>
        <ul class="d-flex list-unstyled mt-auto pt-5 mb-0 align-items-end">
              <li class="me-auto">
                <small id="article-user-${article.id}"></small>
              </li>
              <li class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="currentColor" class="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>
                <small>${place[0]}</small >
              </li >
            </ul >
    
        </div>
        </div>
        </div>
        `
        location_list.innerHTML += location_listHTML
        const article_content = document.getElementById(`article-${article.id}`)
        article_content.innerText = article.content
        const article_title = document.getElementById(`article-title-${article.id}`)
        article_title.innerText = article.title
        const article_user = document.getElementById(`article-user-${article.id}`)
        article_user.innerText = article.user
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
