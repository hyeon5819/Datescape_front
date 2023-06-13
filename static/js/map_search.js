const searchInput = document.getElementById("tags");
const ul = document.getElementById("tag_ul")

// 문자열 형식
function testListTextGet() {
    let tagListText = ''
    const tagList = ul.childNodes
    for (let i = 1; i < tagList.length; i++) {
        tagListText += '#' + tagList[i].textContent
    }

    return tagListText
}


window.onload = function () {
    // 엔터로 태그 추가
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // 엔터 키 입력
            let tagname = searchInput.value.trim()

            if (tagname == '') {
                alert('태그를 작성해주세요!')
            } else {
                if (tagname in testListTextGet().split('#')){
                    searchInput.value = ''
                } else {
                    const tagli = document.createElement('li')
                    tagli.addEventListener('click', function () {
                        tagli.remove()
                    })
                    tagli.textContent = tagname
                    ul.appendChild(tagli)
                    searchInput.value = ''
                }
            }
        }
    });
    
    //주소가져오기
    document.getElementById("address_kakao").addEventListener("click", function () { //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) { //선택시 입력값 세팅
                document.getElementById("address_kakao_input").value = data.address // 주소 넣기
                document.getElementById("jibunAddress").value = data.jibunAddress // 지번 주소 넣기
                document.getElementById("roadAddress").value = data.roadAddress // 도로명 주소 넣기

            }
        }).open()
    })
    //저장
    document.getElementById("save_db").addEventListener("click", function () { //주소입력칸을 클릭하면
        const access = localStorage.getItem("access");
        // 데이터 전송을 위한 변수 선언
        const formData = new FormData();
        data = document.getElementById("jibunAddress").value;
        title = document.getElementById("title").value;
        image = document.getElementById("image").files;
        content = document.getElementById("content").value;
        score = document.getElementById("score").value;
        tags = testListTextGet();
        //formData.append('query', data)
        formData.append('query', data);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        formData.append('score', score);
        formData.append('tags', tags);
        fetch(`${back_base_url}/articles/search/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        })
            .then(response => {
                console.log(response, "response")
                console.log(data, "data")
                if (!response.ok) {
                    throw new Error('저장실패');
                }
                return document.getElementById("jibunAddress").value;
            })
            .then(data => {
                console.log('data', data);
                console.log('저장완료', data);
            })
            .catch(error => {
                console.error(error);
            });

    })
}
