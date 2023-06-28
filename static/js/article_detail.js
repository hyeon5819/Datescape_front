token = localStorage.getItem("access")
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");
const userId = JSON.parse(localStorage.getItem("payload")).user_id;
// const payload = localStorage.getItem("payload");


/*게시글 정보 가져오기 */
window.onload = async () => {
    if (!localStorage.getItem("access")) {
        alert("로그인이 필요합니다.")
        window.location.href = `${front_base_url}/templates/logintemp.html`
    }

    const response = await fetch(`${back_base_url}/articles/${articleId}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    let data = await response.json()
    let add_html = document.querySelector('#add_html')
    let articleHtml = ``

    if (response.status == 200) {
        articleHtml = `
        <div style="display: flex;" class="detail_title justify-content-between">
            <h1 style="text-align:center; margin-top:50px">${data.title}</h1>
            <button type="button" class="btn btn-outline-secondary " id="article-report-button">신고버튼</button>
        </div><!-- e:detail_title -->
        <div class="detail_box">
            <div class="title_box">
                <div class="title_left">
                    <p class="user">
                        작성자: <span class="title_left_user">${data.user}</span>
                    </p><!-- e:user -->
                </div><!-- e:title_left -->
                <div class="title_center mb-5">
                    <img src="${image_url}${data.main_image}" alt=""><!-- e:대표이미지 -->
                </div><!-- e:title_center -->
                <div class="title_right" id = "detail-buttons">
                </div><!-- e:title_right -->
            </div><!-- e:title_box -->
            <div id="image_box">
            </div><!-- e:image_box -->
            <div class="content_box mb-5" id="article-content">
            </div><!-- e:content_box -->
            <div class="map_box">
                <div id="tag_box" class="mb-5">
                </div>
                <div class="map_content">
                    <p class="fs-5">${data.road_address}</p>
                    <div id="map"></div>
                    <p>주변 명소 확인을 클릭하시고 마커를 클릭하시면 더 자세한 정보가 나옵니다.</p>
                    <button class="display_block btn btn-outline-secondary text-center mt-4" type="button" onclick="loadNearArticle(${data.coordinate_y},${data.coordinate_x})">주변 명소 확인</button>
                </div>
        </div><!-- e:map_box -->
        </div><!-- e:detail_box -->
                `
    }
    add_html.innerHTML = articleHtml
    const article_content = document.getElementById(`article-content`)
    article_content.innerText = data.content
    // 태그 출력부분
    let tag_box = document.querySelector('#tag_box')
    let tagHtml = ``
    for (let i = 0; i < await data.tags.length; i++) {
        tagHtml += `
        <a href="${front_base_url}/templates/search_list.html?option=tag&search=${data.tags[i].tag}&page=1&/">#${data.tags[i].tag}</a>
        `
        tag_box.innerHTML = tagHtml
    }
    //다중이미지 출력부분
    let image_box = document.querySelector('#image_box')
    let imageHtml = ``
    for (let i = 0; i < await data.image.length; i++) {
        imageHtml += `
            <img src="${image_url}${data.image[i]["image"]}" alt="...">
        `
        // tag_add += '#' + data.results[i].tags[a].tag + ' '
    }
    image_box.innerHTML = imageHtml
    loadArticlePosition(data)

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    let detailButtons = document.querySelector('#detail-buttons')
    if (data.user === payload_parse.nickname) {
        detailButtons.innerHTML = `
        <button class="btn btn-outline-secondary" type="button" id="article_bookmark" onclick="articleBookMark(${articleId})">북마크</button>
        <a href="${front_base_url}/templates/article_update.html?id=${articleId}&/" button
                        class="btn btn-outline-secondary" type="button" id="article-fix">수정</a>
                    <a button class="btn btn-outline-secondary" onclick="articleDelete()" type="button">삭제</a>
                    <a href="${front_base_url}/templates/article_list.html" class="btn btn-outline-secondary"
                        type="button">목록</a>`
    } else {
        detailButtons.innerHTML = `
        <button
                        class="btn btn-outline-secondary" type="button" id="article_bookmark" onclick="articleBookMark(${articleId})">북마크</button>
        <a href="${front_base_url}/templates/article_list.html" class="btn btn-outline-secondary"
                        type="button">목록</a>`
    }

    const bookmarkButton = document.getElementById('article_bookmark')
    if (data.book_mark.includes(userId)) {
        bookmarkButton.innerText = "📖북마크 취소"
    } else {
        bookmarkButton.innerText = "📘북마크 등록"
    }
    /*게시글신고*/
    article_report_button = document.getElementById("article-report-button")
    article_report_button.setAttribute('onclick', `Report_button(2,${articleId})`)
    /*게시글수정*/
}
async function articleDelete() {
    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(
            `${back_base_url}/articles/${articleId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            }
        );
        if (response.status == 204) {
            alert("삭제되었습니다.");
            // window.opener.location.reload()
            window.close()
            window.location.href = `${front_base_url}/templates/article_list.html`
        } else {
            alert("권한이 없습니다!");
        }
    } else {
        // 취소 버튼을 눌렀을 경우
        return false;
    }
}
/*지도에 좌표 찍기 */
async function loadArticlePosition(position) {
    // 내 위치 표시
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(position.coordinate_y, position.coordinate_x), //지도의 중심좌표.(위도,경도)
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    // 마커 위치 설정
    var articlePosition = new kakao.maps.LatLng(position.coordinate_y, position.coordinate_x);
    // 마커 생성
    var myMarker = new kakao.maps.Marker({
        position: articlePosition
    });
    // 마커가 지도 위에 표시되도록 설정
    myMarker.setMap(map);
}

/*게시글 주변 데이터 가져옴기 */
async function loadNearArticle(latitude, longitude) {
    // 주변 데이터 요청

    const nearPositions = await getNearPosition(latitude, longitude, 2)

    // 주변 마커 생성
    nearPositions.forEach(point => {
        var jibun = point.jibun_address
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
        link_a.setAttribute("class", "link stop-scrolling")
        link_a.setAttribute("style", "cursor:pointer;")
        link_a.setAttribute("onclick", `loadArticleList(${point.id})`)
        // link_a.setAttribute("href", "#")
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
        kakao.maps.event.addListener(marker, 'click', function () {
            overlay.setMap(map);

        });
    });
}
// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    overlay.setMap(null)
}


// 주변 데이터 리스트 형식
async function loadArticleList(location) {
    // 리뷰 데이터 가져오기
    const response = await getNearAritcle(location)
    const location_list = document.getElementById('near-articles')
    let swiper_block = document.querySelector('.swiper')
    swiper_block.style = 'display:block;'

    location_list.innerHTML = ''
    response.results.forEach(article => {
        var jibun = article.jibun_address
        var place = jibun.split(' ')
        location_list.innerHTML += `
        <div class="swiper-slide" >
            <div class="card text-bg-dark border-light rounded-4" style="height:300px; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}&/';">
            <img src="${article.main_image}" class="card-img cardimg mh-100 rounded-4" alt="..." >
                <div class="card-img-overlay img-cover rounded-4" style="padding: 30px;">
                    <h4 class="card-title card_title mt-3">${article.title}</h4>
                    <p class="card-text content mb-5">${article.content}</p>
                    <ul class="d-flex list-unstyled mt-auto pt-5 mb-0 align-items-end">
                        <li class="me-auto">
                            <small>${article.user}</small>
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
    });

    swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        // effect: 'fade',
        // autoplay: { delay: 5000, },

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
        allowTouchMove: false,
    });

}



// 북마크
async function articleBookMark(article_id) {
    const formData = new FormData()

    formData.append("article_id", article_id)

    const response = await fetch(`${back_base_url}/articles/bookmark/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData
    })
    const data = await response.json()
    if (response.status == 200) {
        alert(data.message)
        window.location.reload()
    } else {
        alert(data.message)
    }
}
