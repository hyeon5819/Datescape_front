async function getSearch(option, search, page) {
    const response = await fetch(`${back_base_url}/articles/article-search/?option=${option}&search=${search}&page=${page}&/`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

async function getRandom(option) {
    const response = await fetch(`${back_base_url}/articles/article-random/?option=${option}&/`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

function selectOption(x) {
    if (x == 1) {
        document.getElementById('option').innerHTML = "제목+내용"
    } else if (x == 0) {
        document.getElementById('option').innerHTML = "전체"
    } else if (x == 2) {
        document.getElementById('option').innerHTML = "태그"
    } else {
        document.getElementById('option').innerHTML = "지역"
    }
}

// 엔터로 검색하기
var input = document.getElementById("search");

input.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("button-addon2").click();
    }
});


async function submitSearch() {
    let option = document.getElementById('option').innerHTML
    let options = {
        "제목+내용": "article",
        "전체": "all",
        "태그": "tag",
        "지역": "location",
    }
    const search = document.getElementById('search').value
    window.location.href = `${front_base_url}/templates/search_list.html?option=${options[option]}&search=${search}&page=1&/`
}

async function getAddress(position) {
    // kakao api를 이용해서 좌표를 주소로 바꿔주기
    // https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}&input_coord=WGS84&/`, {
        method: 'GET',
        headers: {
            'Authorization': `KakaoAK ${REST_API_KEY}`
        },
    })
    const response_json = await response.json()
    //html에 위치 띄우기
    const mylocation = document.getElementById('mylocation')
    mylocation.innerText = response_json.documents[0].address.address_name
}

// 근처 데이터 가져오기
async function getNearPosition(latitude, longitude, dist) {
    const response = await fetch(`${back_base_url}/articles/location-list/?lat=${latitude}&lon=${longitude}&dist=${dist}&/`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

// 장소 리뷰 가져오기
async function getNearAritcle(location) {
    const response = await fetch(`${back_base_url}/articles/location-articles/?location=${location}&/`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}
