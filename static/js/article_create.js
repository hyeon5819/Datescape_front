if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
}

async function getWeeklyTags() {
    const response = await fetch(`${back_base_url}/articles/weekly-tags/`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}


const access = localStorage.getItem("access")
// 대표 이미지 선택 시 미리보기
function getMainImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;
    const imagePreview = document.querySelector('#main-image-preview');
    const docFrag = new DocumentFragment();

    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 2) {
            uploadFiles.push(file);
            const reader = new FileReader();
            imagePreview.innerHTML = ''
            reader.onload = (e) => {
                const preview = createElement(e, file);
                imagePreview.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

const mainImageUpload = document.getElementById("main_image");
mainImageUpload.addEventListener('change', getMainImageFiles);



// 이미지 선택 시 미리보기
function getImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;
    const imagePreview = document.querySelector('#image-preview');
    const docFrag = new DocumentFragment();

    if ([...files].length >= 10) {
        alert('이미지는 최대 9개 까지 업로드가 가능합니다.');
        return;
    }

    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 10) {
            uploadFiles.push(file);
            const reader = new FileReader();
            imagePreview.innerHTML = ''
            reader.onload = (e) => {
                const preview = createElement(e, file);
                imagePreview.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

function createElement(e, file) {
    const div = document.createElement('div');
    div.setAttribute('class', 'col')
    const div2 = document.createElement('div');
    div2.setAttribute('style', 'height:150px; width:150px;')
    div.appendChild(div2)
    const img = document.createElement('img');
    img.setAttribute('src', e.target.result);
    img.setAttribute('class', 'cardimg img-thumbnail');
    img.setAttribute('data-file', file.name);
    div2.appendChild(img);

    return div;
}
const imageUpload = document.getElementById("images");
imageUpload.addEventListener('change', getImageFiles);

const searchInput = document.getElementById("tags");
const ul = document.getElementById("tag_ul")
let page_num = 0
// 문자열 형식
function testListTextGet() {
    let tagListText = ''
    const tagList = ul.childNodes
    for (let i = 1; i < tagList.length; i++) {
        tagListText += '$%#&#^)!()' + tagList[i].textContent
    }

    return tagListText
}
// 평점 range사용으로 게이지 연출 부분
document.querySelector('#score_in').addEventListener('input', element => {
    document.querySelector('#score_out').value = element.target.value;
});
// 평점 range로 수정한 범위 number type에 value값 주입
document.querySelector('#score_out').addEventListener('input', element => {
    document.querySelector('#score_in').value = element.target.value
})
async function PostArticle(formData) {
    // 데이터 전송을 위한 변수 선언
    const response = await fetch(`${back_base_url}/articles/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: formData,
    })
    if (response.status == 200) {
        response_data = await response.json();
        window.location.href = `${front_base_url}/templates/article_detail.html?id=${response_data}&/`

        return;
    } else {
        alert(response.status);
    }
}


window.onload = async function () {
    // 오늘의 태그 생성
    const weeklytags = await getWeeklyTags()
    console.log(weeklytags[0])
    const todaytag = document.getElementById('taday-tag')
    todaytag.innerText = `# ${weeklytags[0]['tag']}`
    const tomorrow = document.getElementById('tomorrow-tag')
    tomorrow.innerText = `# ${weeklytags[1]['tag']}`

    // 엔터로 태그 추가
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // 엔터 키 입력
            let tagname = searchInput.value.trim()

            if (tagname == '') {
                alert('태그를 작성해주세요!')
            } else {
                if (testListTextGet().split('$%#&#^)!()').includes(tagname)) {
                    searchInput.value = ''
                    alert("이미 입력된 태그입니다!")
                } else {
                    const tagli = document.createElement('div')
                    tagli.setAttribute("class", "tag_add")
                    tagli.textContent = tagname
                    ul.appendChild(tagli)

                    const tagDel = document.createElement('img')
                    tagDel.addEventListener('click', function () {
                        tagli.remove()
                    })
                    tagDel.src = 'https://www.shareicon.net/data/512x512/2015/12/04/682349_button_512x512.png'
                    tagDel.setAttribute('class', 'tag_del')
                    tagli.appendChild(tagDel)

                    searchInput.value = ''
                }
            }
        }
    });




    searchInput.addEventListener('keydown', function (event) {
        // 백스페이스로 태그 제거
        if (event.key === 'Backspace') {
            const addedTags = document.getElementById('tag_ul').childNodes
            let lastNum = addedTags.length
            if (addedTags.length >= 2) {
                if (searchInput.value == '') {
                    if (confirm("태그 삭제?")) {
                        addedTags[lastNum - 1].remove()
                    } else {
                        return false;
                    }
                }
            }
        }
    })


    //주소가져오기
    //게시글을저장하면 작성한 게시글 페이지로 이동 시키기
    document.getElementById("roadAddress").addEventListener("click", function () { //주소입력칸을 클릭하면

        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) { //선택시 입력값 세팅
                document.getElementById("roadAddress").value = data.roadAddress // 도로명 주소 넣기
                //좌표지도출력부분
                var map = new kakao.maps.Map(document.getElementById('map'), {
                    center: new kakao.maps.LatLng(37.502327, 127.0444447), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                });

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new kakao.maps.services.Geocoder();

                // 주소로 좌표를 검색합니다
                geocoder.addressSearch(data.address, function (result, status) {
                    // 정상적으로 검색이 완료됐으면 
                    if (status === kakao.maps.services.Status.OK) {
                        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                        // 결과값으로 받은 위치를 마커로 표시합니다
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coords,
                            draggable: true // 마커를 드래그 가능하도록 설정합니다
                        });

                        // 주소를 클릭하면 마커를 옮기고 인포윈도우를 열도록 등록합니다
                        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
                            // 클릭한 위도, 경도 정보를 가져옵니다 
                            var latlng = mouseEvent.latLng;

                            // 좌표를 인자로 넘겨 마커의 위치를 변경합니다
                            marker.setPosition(latlng);

                            // Reverse Geocoding해서 지번 주소를 검색합니다 
                            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function (result, status) {
                                if (status === kakao.maps.services.Status.OK) {
                                    // 해당 위치의 지번 주소를 input 태그에 표시합니다
                                    document.getElementById("roadAddress").value = result[0].address['address_name']
                                }
                            });

                        });

                        // 지도에 마커를 등록합니다
                        marker.setMap(map);

                        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                        map.setCenter(coords);
                    }
                });

            }
        }).open()
    })
    const access = localStorage.getItem("access");
    async function GetArticleId(article_id) {
        const response = await fetch(`${back_base_url} /articles/`, {
            headers: {
                Authorization: `Bearer ${access} `,
            },
            method: 'GET',
        })

        const data = await response.json()
        page_num = data.count
        window.location.href = `${front_base_url} /templates/article_detail.html ? id = ${page_num}& /`
    }
    // GetArticleId(page_num)
    //저장
    document.querySelector('form').addEventListener("submit", event => { //주소입력칸을 클릭하면
        event.preventDefault();
        // // 데이터 전송을 위한 변수 선언
        const formData = new FormData();
        const data = document.getElementById("roadAddress").value;
        const title = document.getElementById("title").value;
        const main_image = document.getElementById("main_image").files;
        const image = document.getElementById("images").files;
        const content = document.getElementById("content").value;
        const score = document.getElementById("score_in").value;

        const tags = testListTextGet();
        formData.append('query', data);
        formData.append('title', title);
        formData.append('content', content);
        for (let i = 0; i < image.length; i++) {
            formData.append("images", image[i]);
        }
        for (let i = 0; i < main_image.length; i++) {
            formData.append("main_image", main_image[i]);
        }
        formData.append('score', score);
        formData.append('tags', tags);

        PostArticle(formData)
    })
}

